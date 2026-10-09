// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getPartnerMock,
  createPartnerMock,
  updatePartnerMock,
  showToastMock,
} = vi.hoisted(() => ({
  getPartnerMock: vi.fn(),
  createPartnerMock: vi.fn(),
  updatePartnerMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getPartner: getPartnerMock,
  createPartner: createPartnerMock,
  updatePartner: updatePartnerMock,
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

vi.mock('../shared/ImageUpload', () => ({
  ImageUpload: ({
    value,
    onChange,
  }: {
    value: string | null;
    onChange: (url: string | null) => void;
  }) => (
    <button type="button" onClick={() => onChange(value ? null : 'https://example.com/logo.png')}>
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

import PartnerFormPage from './PartnerFormPage';

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

describe('PartnerFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/partners/new';

    getPartnerMock.mockResolvedValue({ data: null, error: null });
    createPartnerMock.mockResolvedValue({ data: { id: 'partner-1' }, error: null });
    updatePartnerMock.mockResolvedValue({ data: { id: 'partner-1' }, error: null });

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

  it('blocks submit when required fields are blank', async () => {
    await act(async () => {
      root.render(<PartnerFormPage />);
    });

    expect(container.querySelector('a[href="#/partners"]')?.textContent).toContain('Back to partners');

    const nameInput = Array.from(container.querySelectorAll('input[type="text"], input[type="url"]'))[0] as HTMLInputElement;
    const websiteInput = container.querySelector('input[type="url"]') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(nameInput, '');
      setInputValue(websiteInput, '');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPartnerMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Name is required');
  });

  it('creates a partner and navigates back to the partners list', async () => {
    await act(async () => {
      root.render(<PartnerFormPage />);
    });

    const inputs = Array.from(container.querySelectorAll('input[type="text"], input[type="url"], input[type="number"]')) as HTMLInputElement[];
    const nameInput = inputs[0];
    const websiteInput = container.querySelector('input[type="url"]') as HTMLInputElement;
    const orderInput = container.querySelector('input[type="number"]') as HTMLInputElement;
    const status = container.querySelector('select[aria-label="Status"]') as HTMLSelectElement;
    const imageButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Toggle image')
    ) as HTMLButtonElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(nameInput, 'UNDP');
      setInputValue(websiteInput, 'https://www.undp.org/');
      setInputValue(orderInput, '4');
      setInputValue(status, 'published');
      imageButton.click();
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPartnerMock).toHaveBeenCalledWith({
      name: 'UNDP',
      logo_url: 'https://example.com/logo.png',
      website_url: 'https://www.undp.org/',
      display_order: 4,
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Partner created', 'success');
    expect(window.location.hash).toBe('#/partners');
  });

  it('loads an existing partner and updates it', async () => {
    getPartnerMock.mockResolvedValue({
      data: {
        name: 'Existing Partner',
        logo_url: 'https://example.com/old-logo.png',
        website_url: 'https://example.org/',
        display_order: 2,
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<PartnerFormPage id="partner-42" />);
    });
    await flushEffects();

    const websiteInput = container.querySelector('input[type="url"]') as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    expect(getPartnerMock).toHaveBeenCalledWith('partner-42');

    await act(async () => {
      setInputValue(websiteInput, 'https://updated.example.org/');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updatePartnerMock).toHaveBeenCalledWith('partner-42', {
      name: 'Existing Partner',
      logo_url: 'https://example.com/old-logo.png',
      website_url: 'https://updated.example.org/',
      display_order: 2,
      status: 'draft',
    });
    expect(showToastMock).toHaveBeenCalledWith('Partner updated', 'success');
  });
});
