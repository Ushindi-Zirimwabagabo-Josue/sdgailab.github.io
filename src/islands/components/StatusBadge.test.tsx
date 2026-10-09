// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
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

  it('renders known status labels and color classes', async () => {
    await act(async () => {
      root.render(<StatusBadge status="active" />);
    });

    const badge = container.querySelector('span');
    expect(badge?.textContent).toBe('Active');
    expect(badge?.className).toContain('ui-badge--active');
  });

  it('falls back to the raw status value for unknown statuses', async () => {
    await act(async () => {
      root.render(<StatusBadge status="custom_status" />);
    });

    const badge = container.querySelector('span');
    expect(badge?.textContent).toBe('custom_status');
    expect(badge?.className).toContain('ui-badge--neutral');
  });
});

