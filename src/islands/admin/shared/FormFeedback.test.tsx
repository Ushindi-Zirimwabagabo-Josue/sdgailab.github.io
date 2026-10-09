// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { FormFeedback } from './FormFeedback';
import { expectAccessible } from '../../../test/axe';

describe('FormFeedback', () => {
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

  it('renders nothing when no message is provided', () => {
    act(() => {
      root.render(<FormFeedback type="success" message={null} />);
    });

    expect(container.textContent).toBe('');
  });

  it('renders success and error messages with alert semantics', () => {
    act(() => {
      root.render(<FormFeedback type="success" message="Saved successfully" />);
    });

    expect(container.textContent).toContain('Saved successfully');
    expect(container.querySelector('[role="alert"]')).not.toBeNull();

    act(() => {
      root.render(<FormFeedback type="error" message="Save failed" />);
    });

    expect(container.textContent).toContain('Save failed');
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<FormFeedback type="error" message="Save failed" />);
    });

    await expectAccessible(container);
  });
});
