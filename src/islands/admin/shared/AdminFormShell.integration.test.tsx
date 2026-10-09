// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const { setIsDirtyMock, uploadImageMock } = vi.hoisted(() => ({
  setIsDirtyMock: vi.fn(),
  uploadImageMock: vi.fn(),
}));

vi.mock('../AdminApp', () => ({
  useNavigationGuard: () => ({
    setIsDirty: setIsDirtyMock,
  }),
}));

vi.mock('../../../lib/storage', () => ({
  uploadImage: uploadImageMock,
  replaceImage: vi.fn(),
  deleteImage: vi.fn(),
}));

vi.mock('../../../lib/markdown', () => ({
  renderMarkdown: vi.fn().mockResolvedValue('<p>preview</p>'),
}));

vi.mock('@uiw/react-md-editor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <textarea
      aria-label="Markdown body"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
  commands: {},
}));

import { ConfirmDialog } from './ConfirmDialog';
import { ContentForm } from './ContentForm';
import { FormFeedback } from './FormFeedback';
import { ImageUpload } from './ImageUpload';
import { MarkdownField } from './MarkdownField';
import { SlugField } from './SlugField';
import { StatusBadge, StatusSelect } from './StatusSelect';

function AdminFormHarness() {
  return (
    <ContentForm onSubmit={() => {}} isEdit={false} loading={false} backHref="#/back" isDirty>
      <FormFeedback message="Title is required" type="error" />
      <label htmlFor="title">Title</label>
      <input id="title" defaultValue="Draft article" />
      <SlugField value="draft-article" sourceValue="Draft article" onChange={() => {}} />
      <StatusSelect value="draft" onChange={() => {}} label="Status" id="publish-status" />
      <StatusBadge status="draft" />
      <MarkdownField value="Body copy" onChange={() => {}} label="Body" />
      <ImageUpload value={null} folder="news" onChange={() => {}} label="Featured image" />
      <ConfirmDialog
        isOpen
        title="Discard changes?"
        message="Unsaved edits will be lost."
        confirmLabel="Discard"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    </ContentForm>
  );
}

describe('Admin shared form integration', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    uploadImageMock.mockResolvedValue({
      url: 'https://example.com/storage/v1/object/public/public-assets/news/image.png',
      error: null,
    });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('composes shared admin form primitives in one workflow', async () => {
    await act(async () => {
      root.render(<AdminFormHarness />);
    });

    expect(container.textContent).toContain('Title is required');
    expect(container.textContent).toContain('draft-article');
    expect(container.textContent).toContain('Discard changes?');
    expect(container.querySelector('#publish-status')).not.toBeNull();
    expect(container.querySelector('textarea[aria-label="Markdown body"]')).not.toBeNull();
    expect(container.querySelector('input[type="file"]')).not.toBeNull();
    expect(setIsDirtyMock).toHaveBeenCalledWith(true);
  });
});
