// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getPublicationMock,
  createPublicationMock,
  updatePublicationMock,
  showToastMock,
} = vi.hoisted(() => ({
  getPublicationMock: vi.fn(),
  createPublicationMock: vi.fn(),
  updatePublicationMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getPublication: getPublicationMock,
  createPublication: createPublicationMock,
  updatePublication: updatePublicationMock,
}));

vi.mock('../layout/Toast', () => ({
  useToast: () => ({ showToast: showToastMock }),
}));

vi.mock('../AdminApp', () => ({
  useNavigationGuard: () => ({ setIsDirty: vi.fn() }),
}));

vi.mock('../shared/ContentForm', () => ({
  ContentForm: ({
    children,
    onSubmit,
    loading,
  }: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
  }) => (
    <form onSubmit={onSubmit}>
      {children}
      <button type="submit" disabled={loading}>
        Save
      </button>
    </form>
  ),
}));

vi.mock('../shared/SlugField', () => ({
  SlugField: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      aria-label="Slug"
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
    />
  ),
}));

vi.mock('../shared/StatusSelect', () => ({
  StatusSelect: ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }) => (
    <select
      aria-label={label ?? 'Status'}
      value={value}
      onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
    >
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="archived">Archived</option>
    </select>
  ),
}));

vi.mock('../shared/ImageUpload', () => ({
  ImageUpload: ({
    value,
    onChange,
  }: {
    value: string | null;
    onChange: (url: string | null) => void;
  }) => (
    <button type="button" onClick={() => onChange(value ? null : 'https://example.com/cover.png')}>
      Toggle image
    </button>
  ),
}));

vi.mock('../shared/FormFeedback', () => ({
  FormFeedback: ({
    message,
    type,
  }: {
    message: string | null;
    type: 'success' | 'error';
  }) => (message ? <div data-feedback-type={type}>{message}</div> : null),
}));

import PublicationFormPage from './PublicationFormPage';

function setInputValue(
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  value: string
) {
  const proto =
    input instanceof HTMLSelectElement
      ? HTMLSelectElement.prototype
      : input instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('PublicationFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/publications/new';
    getPublicationMock.mockResolvedValue({ data: null, error: null });
    createPublicationMock.mockResolvedValue({ data: { id: 'pub-1' }, error: null });
    updatePublicationMock.mockResolvedValue({ data: { id: 'pub-1' }, error: null });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.location.hash = originalHash;
  });

  it('creates a publication and navigates back to the list', async () => {
    await act(async () => {
      root.render(<PublicationFormPage />);
    });

    expect(container.textContent).toContain('New publication');

    const textInputs = Array.from(container.querySelectorAll('input[type="text"], input:not([type])')) as HTMLInputElement[];
    const titleInput = textInputs[0];
    const slugInput = container.querySelector('input[aria-label="Slug"]') as HTMLInputElement;
    const summary = container.querySelector('textarea') as HTMLTextAreaElement;
    const sourceUrl = container.querySelector('input[type="url"]') as HTMLInputElement;
    const status = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(titleInput, 'New Research Output');
      setInputValue(slugInput, 'new-research-output');
      setInputValue(summary, 'Summary of the output');
      setInputValue(sourceUrl, 'https://example.com/output');
      setInputValue(status, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPublicationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Research Output',
        slug: 'new-research-output',
        summary: 'Summary of the output',
        source_url: 'https://example.com/output',
        status: 'published',
      })
    );
    expect(showToastMock).toHaveBeenCalledWith('Publication created', 'success');
    expect(window.location.hash).toBe('#/publications');
  });

  it('loads an existing publication and updates it', async () => {
    getPublicationMock.mockResolvedValue({
      data: {
        title: 'Existing Output',
        slug: 'existing-output',
        publication_type: 'report',
        authors: 'Ada',
        publication_date: '2024-02-01',
        date_label: '',
        publisher: 'UNDP',
        summary: 'Existing summary',
        source_url: 'https://example.com/existing',
        cover_image_url: null,
        display_order: 2,
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<PublicationFormPage id="pub-42" />);
    });
    await flushEffects();

    expect(getPublicationMock).toHaveBeenCalledWith('pub-42');
    expect(container.textContent).toContain('Edit publication');

    const summary = container.querySelector('textarea') as HTMLTextAreaElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(summary, 'Updated summary');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updatePublicationMock).toHaveBeenCalledWith(
      'pub-42',
      expect.objectContaining({
        title: 'Existing Output',
        summary: 'Updated summary',
      })
    );
    expect(showToastMock).toHaveBeenCalledWith('Publication updated', 'success');
  });
});
