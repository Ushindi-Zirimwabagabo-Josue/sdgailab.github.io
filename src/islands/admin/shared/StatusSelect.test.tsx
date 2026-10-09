// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { StatusBadge, StatusSelect } from './StatusSelect';
import { expectAccessible } from '../../../test/axe';

function setSelectValue(select: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  setter?.call(select, value);
  select.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('StatusSelect', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
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

  it('renders the status label and forwards changes', async () => {
    const onChange = vi.fn();

    await act(async () => {
      root.render(<StatusSelect value="draft" onChange={onChange} label="Publishing Status" />);
    });

    const select = container.querySelector('select#status-select') as HTMLSelectElement;

    expect(container.textContent).toContain('Publishing Status');

    await act(async () => {
      setSelectValue(select, 'published');
    });

    expect(onChange).toHaveBeenCalledWith('published');
  });

  it('renders status badges with the provided label', async () => {
    await act(async () => {
      root.render(<StatusBadge status="published" />);
    });

    const badge = container.querySelector('span');
    expect(badge?.textContent).toBe('published');
    expect(badge?.className).toContain('bg-green-500/15');
  });

  it('falls back to neutral styling for unknown statuses', async () => {
    await act(async () => {
      root.render(<StatusBadge status="unknown" />);
    });

    const badge = container.querySelector('span');
    expect(badge?.className).toContain('bg-lab-section');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<StatusSelect value="draft" onChange={() => {}} label="Publishing Status" />);
    });

    await expectAccessible(container);
  });
});
