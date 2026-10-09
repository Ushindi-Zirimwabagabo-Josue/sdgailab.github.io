// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getEvolutionTimelineItemMock,
  createEvolutionTimelineItemMock,
  updateEvolutionTimelineItemMock,
  showToastMock,
} = vi.hoisted(() => ({
  getEvolutionTimelineItemMock: vi.fn(),
  createEvolutionTimelineItemMock: vi.fn(),
  updateEvolutionTimelineItemMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getEvolutionTimelineItem: getEvolutionTimelineItemMock,
  createEvolutionTimelineItem: createEvolutionTimelineItemMock,
  updateEvolutionTimelineItem: updateEvolutionTimelineItemMock,
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

vi.mock('../shared/FormFeedback', () => ({
  FormFeedback: ({
    message,
    type,
  }: {
    message: string | null;
    type: 'success' | 'error';
  }) => (message ? <div data-feedback-type={type}>{message}</div> : null),
}));

import EvolutionTimelineFormPage from './EvolutionTimelineFormPage';

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

describe('EvolutionTimelineFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/evolution-timeline/new';
    getEvolutionTimelineItemMock.mockResolvedValue({ data: null, error: null });
    createEvolutionTimelineItemMock.mockResolvedValue({ data: { id: 'tl-1' }, error: null });
    updateEvolutionTimelineItemMock.mockResolvedValue({ data: { id: 'tl-1' }, error: null });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    window.location.hash = originalHash;
  });

  it('creates a timeline entry and navigates back to the list', async () => {
    await act(async () => {
      root.render(<EvolutionTimelineFormPage />);
    });

    expect(container.textContent).toContain('New Timeline Entry');

    const textInputs = Array.from(
      container.querySelectorAll('input[type="text"]')
    ) as HTMLInputElement[];
    const periodInput = textInputs[0];
    const titleInput = textInputs[1];
    const body = container.querySelector('textarea') as HTMLTextAreaElement;
    const status = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(periodInput, '2026');
      setInputValue(titleInput, 'Mainstreaming');
      setInputValue(body, 'Live timeline body');
      setInputValue(status, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createEvolutionTimelineItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        period: '2026',
        title: 'Mainstreaming',
        body: 'Live timeline body',
        status: 'published',
      })
    );
    expect(showToastMock).toHaveBeenCalledWith('Timeline entry created', 'success');
    expect(window.location.hash).toBe('#/evolution-timeline');
  });

  it('loads an existing timeline entry and updates it', async () => {
    getEvolutionTimelineItemMock.mockResolvedValue({
      data: {
        period: '2019-2020',
        title: 'Foundations',
        body: 'Early work',
        display_order: 1,
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<EvolutionTimelineFormPage id="tl-42" />);
    });
    await flushEffects();

    expect(getEvolutionTimelineItemMock).toHaveBeenCalledWith('tl-42');
    expect(container.textContent).toContain('Edit Timeline Entry');

    const body = container.querySelector('textarea') as HTMLTextAreaElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(body, 'Updated body');
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updateEvolutionTimelineItemMock).toHaveBeenCalledWith(
      'tl-42',
      expect.objectContaining({
        period: '2019-2020',
        title: 'Foundations',
        body: 'Updated body',
      })
    );
    expect(showToastMock).toHaveBeenCalledWith('Timeline entry updated', 'success');
  });
});
