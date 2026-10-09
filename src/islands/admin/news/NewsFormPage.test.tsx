// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getNewsArticleMock,
  createNewsArticleMock,
  updateNewsArticleMock,
  showToastMock,
} = vi.hoisted(() => ({
  getNewsArticleMock: vi.fn(),
  createNewsArticleMock: vi.fn(),
  updateNewsArticleMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getNewsArticle: getNewsArticleMock,
  createNewsArticle: createNewsArticleMock,
  updateNewsArticle: updateNewsArticleMock,
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
      aria-label={label ?? 'Body'}
      value={value}
      onChange={(e) => onChange((e.target as HTMLTextAreaElement).value)}
    />
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
    <button
      type="button"
      onClick={() => onChange(value ? null : 'https://example.com/news-image.png')}
    >
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

import NewsFormPage from './NewsFormPage';

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

describe('NewsFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/news/new';

    getNewsArticleMock.mockResolvedValue({ data: null, error: null });
    createNewsArticleMock.mockResolvedValue({ data: { id: 'news-1' }, error: null });
    updateNewsArticleMock.mockResolvedValue({ data: { id: 'news-1' }, error: null });

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

  it('blocks submit when body is blank', async () => {
    await act(async () => {
      root.render(<NewsFormPage />);
    });

    expect(container.querySelector('a[href="#/news"]')?.textContent).toContain('Back to news');

    const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
    const slugInput = container.querySelector('input[aria-label="Slug"]') as HTMLInputElement;
    const body = container.querySelector('textarea[aria-label="Body *"]') as HTMLTextAreaElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(titleInput, 'My article');
      setInputValue(slugInput, 'my-article');
      setInputValue(body, '   ');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createNewsArticleMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Body is required');
  });

  it('creates an article and navigates back to the news list', async () => {
    await act(async () => {
      root.render(<NewsFormPage />);
    });

    const textInputs = Array.from(container.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
    const titleInput = textInputs[0];
    const slugInput = container.querySelector('input[aria-label="Slug"]') as HTMLInputElement;
    const body = container.querySelector('textarea[aria-label="Body *"]') as HTMLTextAreaElement;
    const summary = container.querySelector('textarea:not([aria-label])') as HTMLTextAreaElement;
    const authorInput = textInputs[textInputs.length - 1];
    const publishDateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    const statusSelect = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const imageButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Toggle image')
    ) as HTMLButtonElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(titleInput, 'My article');
      setInputValue(slugInput, 'my-article');
      setInputValue(body, 'Article body');
      setInputValue(summary, 'Summary text');
      setInputValue(authorInput, 'A. Writer');
      setInputValue(publishDateInput, '2026-07-15');
      setInputValue(statusSelect, 'published');
      imageButton.click();
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createNewsArticleMock).toHaveBeenCalledWith({
      title: 'My article',
      slug: 'my-article',
      body: 'Article body',
      summary: 'Summary text',
      featured_image_url: 'https://example.com/news-image.png',
      author_name: 'A. Writer',
      publish_date: '2026-07-15',
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Article created', 'success');
    expect(window.location.hash).toBe('#/news');
  });

  it('loads an existing article and updates it in place', async () => {
    getNewsArticleMock.mockResolvedValue({
      data: {
        title: 'Existing article',
        slug: 'existing-article',
        body: 'Existing body',
        summary: 'Existing summary',
        featured_image_url: 'https://example.com/old-news-image.png',
        author_name: 'Reporter',
        publish_date: '2026-07-10',
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<NewsFormPage id="news-42" />);
    });
    await flushEffects();

    const body = container.querySelector('textarea[aria-label="Body *"]') as HTMLTextAreaElement;
    const statusSelect = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    expect(getNewsArticleMock).toHaveBeenCalledWith('news-42');

    await act(async () => {
      setInputValue(body, 'Updated body');
      setInputValue(statusSelect, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updateNewsArticleMock).toHaveBeenCalledWith('news-42', {
      title: 'Existing article',
      slug: 'existing-article',
      body: 'Updated body',
      summary: 'Existing summary',
      featured_image_url: 'https://example.com/old-news-image.png',
      author_name: 'Reporter',
      publish_date: '2026-07-10',
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Article updated', 'success');
  });
});
