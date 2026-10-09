// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getPageContentByIdMock,
  createPageContentMock,
  updatePageContentMock,
  showToastMock,
} = vi.hoisted(() => ({
  getPageContentByIdMock: vi.fn(),
  createPageContentMock: vi.fn(),
  updatePageContentMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getPageContentById: getPageContentByIdMock,
  createPageContent: createPageContentMock,
  updatePageContent: updatePageContentMock,
}));

vi.mock('../layout/Toast', () => ({
  useToast: () => ({
    showToast: showToastMock,
  }),
}));

vi.mock('../AdminApp', () => ({
  useNavigationGuard: () => ({
    setIsDirty: vi.fn(),
  }),
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

vi.mock('../shared/MarkdownField', () => ({
  MarkdownField: ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (value: string) => void;
    label?: string;
  }) => (
    <textarea
      aria-label={label ?? 'Content'}
      value={value}
      onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
    />
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

import PageContentFormPage from './PageContentFormPage';

function setInputValue(input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const proto =
    input instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : input instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('PageContentFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/page-content/new';

    getPageContentByIdMock.mockResolvedValue({ data: null, error: null });
    createPageContentMock.mockResolvedValue({ data: { id: 'content-1' }, error: null });
    updatePageContentMock.mockResolvedValue({ data: { id: 'content-1' }, error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    window.location.hash = originalHash;
  });

  it('blocks submit when content is blank', async () => {
    await act(async () => {
      root.render(<PageContentFormPage />);
    });

    const pageSlug = container.querySelector('#page-slug') as HTMLSelectElement;
    const sectionSlug = container.querySelector('#section-slug') as HTMLSelectElement;
    const body = container.querySelector('textarea[aria-label="Content *"]') as HTMLTextAreaElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(pageSlug, 'about');
      setInputValue(sectionSlug, 'intro-body');
      setInputValue(body, '   ');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPageContentMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Content is required');
  });

  it('creates page content and navigates back to the page-content list', async () => {
    await act(async () => {
      root.render(<PageContentFormPage />);
    });

    const pageSlug = container.querySelector('#page-slug') as HTMLSelectElement;
    const sectionSlug = container.querySelector('#section-slug') as HTMLSelectElement;
    const body = container.querySelector('textarea[aria-label="Content *"]') as HTMLTextAreaElement;
    const status = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(pageSlug, 'about');
      setInputValue(sectionSlug, 'intro-body');
      setInputValue(body, 'Mission content');
      setInputValue(status, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPageContentMock).toHaveBeenCalledWith({
      page_slug: 'about',
      section_slug: 'intro-body',
      body: 'Mission content',
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Page content created', 'success');
    expect(window.location.hash).toBe('#/page-content');
  });

  it('loads existing page content and updates it', async () => {
    getPageContentByIdMock.mockResolvedValue({
      data: {
        page_slug: 'contact',
        section_slug: 'intro',
        body: 'Old content',
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<PageContentFormPage id="content-42" />);
    });
    await flushEffects();

    const body = container.querySelector('textarea[aria-label="Content *"]') as HTMLTextAreaElement;
    const status = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    expect(getPageContentByIdMock).toHaveBeenCalledWith('content-42');

    await act(async () => {
      setInputValue(body, 'Updated content');
      setInputValue(status, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updatePageContentMock).toHaveBeenCalledWith('content-42', {
      page_slug: 'contact',
      section_slug: 'intro',
      body: 'Updated content',
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Page content updated', 'success');
  });
});
