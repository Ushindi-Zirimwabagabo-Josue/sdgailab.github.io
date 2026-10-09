// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { SlugField } from './SlugField';
import { expectAccessible } from '../../../test/axe';

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
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

describe('SlugField', () => {
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

  it('derives an initial slug from the source value', async () => {
    const onChange = vi.fn();

    await act(async () => {
      root.render(<SlugField value="" sourceValue="AI for Good 2026" onChange={onChange} />);
    });
    await flushEffects();

    expect(onChange).toHaveBeenCalledWith('ai-for-good-2026');
    expect(container.textContent).toContain('Slug: /');
  });

  it('updates the slug when the source changes and the field was not manually customized', async () => {
    const onChange = vi.fn();

    await act(async () => {
      root.render(<SlugField value="first-post" sourceValue="First Post" onChange={onChange} />);
    });
    await flushEffects();
    onChange.mockClear();

    await act(async () => {
      root.render(<SlugField value="first-post" sourceValue="Second Post" onChange={onChange} />);
    });
    await flushEffects();

    expect(onChange).toHaveBeenCalledWith('second-post');
  });

  it('lets manual edits pass through unchanged', async () => {
    const onChange = vi.fn();

    await act(async () => {
      root.render(<SlugField value="custom-slug" sourceValue="Original Title" onChange={onChange} />);
    });
    await flushEffects();

    const input = container.querySelector('input#slug-field') as HTMLInputElement;

    await act(async () => {
      setInputValue(input, 'my-manual_slug');
    });

    expect(onChange).toHaveBeenLastCalledWith('my-manual_slug');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(
        <SlugField value="custom-slug" sourceValue="Original Title" onChange={() => {}} label="URL slug" />
      );
    });
    await flushEffects();

    await expectAccessible(container);
  });
});
