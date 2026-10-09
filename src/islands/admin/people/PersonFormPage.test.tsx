// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  getPersonMock,
  createPersonMock,
  updatePersonMock,
  showToastMock,
} = vi.hoisted(() => ({
  getPersonMock: vi.fn(),
  createPersonMock: vi.fn(),
  updatePersonMock: vi.fn(),
  showToastMock: vi.fn(),
}));

vi.mock('../../../lib/admin-queries', () => ({
  getPerson: getPersonMock,
  createPerson: createPersonMock,
  updatePerson: updatePersonMock,
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
    <button type="button" onClick={() => onChange(value ? null : 'https://example.com/photo.png')}>
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

import PersonFormPage from './PersonFormPage';

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

describe('PersonFormPage', () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalHash: string;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    originalHash = window.location.hash;
    window.location.hash = '#/people/new';

    getPersonMock.mockResolvedValue({ data: null, error: null });
    createPersonMock.mockResolvedValue({ data: { id: 'person-1' }, error: null });
    updatePersonMock.mockResolvedValue({ data: { id: 'person-1' }, error: null });

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

  it('blocks submit when name is blank', async () => {
    await act(async () => {
      root.render(<PersonFormPage />);
    });

    expect(container.querySelector('a[href="#/people"]')?.textContent).toContain('Back to people');

    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPersonMock).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Name is required');
  });

  it('creates a person and navigates back to the people list', async () => {
    await act(async () => {
      root.render(<PersonFormPage />);
    });

    const textInputs = Array.from(container.querySelectorAll('input[type="text"]')) as HTMLInputElement[];
    const nameInput = textInputs[0];
    const roleInput = textInputs[1];
    const groupSelect = Array.from(container.querySelectorAll('select'))[0] as HTMLSelectElement;
    const biography = container.querySelector('textarea') as HTMLTextAreaElement;
    const orderInput = container.querySelector('input[type="number"]') as HTMLInputElement;
    const status = Array.from(container.querySelectorAll('select')).find((select) =>
      select.getAttribute('aria-label') === 'Status'
    ) as HTMLSelectElement;
    const imageButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Toggle image')
    ) as HTMLButtonElement;
    const form = container.querySelector('form') as HTMLFormElement;

    await act(async () => {
      setInputValue(nameInput, 'Ada Lovelace');
      setInputValue(roleInput, 'Advisor');
      setInputValue(groupSelect, 'advisory_board');
      setInputValue(biography, 'Bio text');
      setInputValue(orderInput, '7');
      setInputValue(status, 'published');
      imageButton.click();
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(createPersonMock).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      role_title: 'Advisor',
      photo_url: 'https://example.com/photo.png',
      group_type: 'advisory_board',
      team_group: null,
      biography: 'Bio text',
      display_order: 7,
      status: 'published',
    });
    expect(showToastMock).toHaveBeenCalledWith('Person created', 'success');
    expect(window.location.hash).toBe('#/people');
  });

  it('loads an existing person and updates it', async () => {
    getPersonMock.mockResolvedValue({
      data: {
        name: 'Existing Person',
        role_title: 'Researcher',
        photo_url: 'https://example.com/old-photo.png',
        group_type: 'team',
        team_group: 'Coordination · Research & Advisory',
        biography: 'Existing bio',
        display_order: 1,
        status: 'draft',
      },
      error: null,
    });

    await act(async () => {
      root.render(<PersonFormPage id="person-42" />);
    });
    await flushEffects();

    const roleInput = Array.from(container.querySelectorAll('input[type="text"]'))[1] as HTMLInputElement;
    const form = container.querySelector('form') as HTMLFormElement;

    expect(getPersonMock).toHaveBeenCalledWith('person-42');

    await act(async () => {
      setInputValue(roleInput, 'Lead Researcher');
    });

    await act(async () => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await flushEffects();

    expect(updatePersonMock).toHaveBeenCalledWith('person-42', {
      name: 'Existing Person',
      role_title: 'Lead Researcher',
      photo_url: 'https://example.com/old-photo.png',
      group_type: 'team',
      team_group: 'Coordination · Research & Advisory',
      biography: 'Existing bio',
      display_order: 1,
      status: 'draft',
    });
    expect(showToastMock).toHaveBeenCalledWith('Person updated', 'success');
  });
});
