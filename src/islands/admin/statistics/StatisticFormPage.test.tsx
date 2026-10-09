// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getStatisticMock,
  createStatisticMock,
  updateStatisticMock,
  showToastMock,
} = vi.hoisted(() => ({
  getStatisticMock: vi.fn(),
  createStatisticMock: vi.fn(),
  updateStatisticMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getStatistic: getStatisticMock,
  createStatistic: createStatisticMock,
  updateStatistic: updateStatisticMock,
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

vi.mock('../shared/FormFeedback', () => ({
  FormFeedback: ({
    message,
    type,
  }: {
    message: string | null;
    type: 'success' | 'error';
  }) => (message ? <div data-feedback-type={type}>{message}</div> : null),
}));

import StatisticFormPage from './StatisticFormPage';

function setInputValue(input: HTMLInputElement | HTMLSelectElement, value: string) {
  const proto = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
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

describe('StatisticFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/statistics/new';

    getStatisticMock.mockResolvedValue({ data: null, error: null });
    createStatisticMock.mockResolvedValue({ data: { id: 'stat-1' }, error: null });
    updateStatisticMock.mockResolvedValue({ data: { id: 'stat-1' }, error: null });

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

  it('creates a statistic and navigates back to the statistics list', async () => {
    await act(async () => {
      root.render(<StatisticFormPage />);
    });

    const textInputs = Array.from(container.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
    const labelInput = textInputs[0];
    const valueInput = textInputs[1];
    const iconInput = textInputs[2];
    const orderInput = container.querySelector('input[type="number"]') as HTMLInputElement;
    const statusSelect = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(labelInput, 'Communities reached');
      setInputValue(valueInput, '42');
      setInputValue(iconInput, 'rocket');
      setInputValue(orderInput, '5');
      setInputValue(statusSelect, 'published');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createStatisticMock).toHaveBeenCalledWith({
      label: 'Communities reached',
      value: '42',
      icon_name: 'rocket',
      display_order: 5,
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Statistic created', 'success');
    expect(window.location.hash).toBe('#/statistics');
  });

  it('loads an existing statistic and updates it in place', async () => {
    getStatisticMock.mockResolvedValue({
      data: {
        label: 'Projects launched',
        value: '10',
        icon_name: 'sparkles',
        display_order: 2,
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<StatisticFormPage id="stat-42" />);
    });
    await flushEffects();

    const valueInput = Array.from(container.querySelectorAll('input[type="text"]'))[1] as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    expect(getStatisticMock).toHaveBeenCalledWith('stat-42');

    await act(async () => {
      setInputValue(valueInput, '11');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updateStatisticMock).toHaveBeenCalledWith('stat-42', {
      label: 'Projects launched',
      value: '11',
      icon_name: 'sparkles',
      display_order: 2,
      status: 'draft',
    });
    expect(showToastMock).toHaveBeenCalledWith('Statistic updated', 'success');
  });
});
