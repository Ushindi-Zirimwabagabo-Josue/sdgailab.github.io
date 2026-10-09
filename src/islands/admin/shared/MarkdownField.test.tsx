// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const { renderMarkdownMock, latestEditorPropsRef } = vi.hoisted(() => ({
  renderMarkdownMock: vi.fn(),
  latestEditorPropsRef: { current: null as any },
}));

vi.mock('../../../lib/markdown', () => ({
  renderMarkdown: renderMarkdownMock,
}));

vi.mock('@uiw/react-md-editor', () => {
  const commands = {
    bold: { name: 'bold' },
    italic: { name: 'italic' },
    title1: { name: 'title1' },
    title2: { name: 'title2' },
    title3: { name: 'title3' },
    divider: { name: 'divider' },
    link: { name: 'link' },
    unorderedListCommand: { name: 'unorderedListCommand' },
    orderedListCommand: { name: 'orderedListCommand' },
    image: { name: 'image' },
    codePreview: { name: 'codePreview' },
  };

  return {
    default: (props: any) => {
      latestEditorPropsRef.current = props;
      const previewNode = props.components.preview(props.value);
      return (
        <div>
          <button type="button" onClick={() => props.onChange('updated from editor')}>
            Trigger change
          </button>
          <div data-editor-value={props.value}>{props.value}</div>
          <div data-command-count={props.commands.length}>{props.commands.length}</div>
          {previewNode}
        </div>
      );
    },
    commands,
  };
});

import { MarkdownField } from './MarkdownField';
import { expectAccessible } from '../../../test/axe';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('MarkdownField', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    latestEditorPropsRef.current = null;
    renderMarkdownMock.mockResolvedValue('<p>preview html</p>');
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

  it('renders the label, editor value, and sanitized preview', async () => {
    await act(async () => {
      root.render(<MarkdownField value="**hello**" onChange={() => {}} label="Body" />);
    });
    await flushEffects();

    expect(container.textContent).toContain('Body');
    expect(container.querySelector('[data-color-mode="dark"]')).not.toBeNull();
    expect(container.querySelector('[data-editor-value="**hello**"]')).not.toBeNull();
    expect(latestEditorPropsRef.current.preview).toBe('live');
    expect(latestEditorPropsRef.current.highlightEnable).toBe(false);
    expect(latestEditorPropsRef.current.height).toBe(420);
    expect(container.querySelector('[data-command-count="12"]')).not.toBeNull();
    expect(renderMarkdownMock).toHaveBeenCalledWith('**hello**');
    expect(container.querySelector('.wmde-markdown')?.innerHTML).toContain('<p>preview html</p>');
  });

  it('forwards editor changes back to the form state', async () => {
    const onChange = vi.fn();

    await act(async () => {
      root.render(<MarkdownField value="initial" onChange={onChange} />);
    });

    const triggerButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Trigger change')
    ) as HTMLButtonElement;

    await act(async () => {
      triggerButton.click();
    });

    expect(onChange).toHaveBeenCalledWith('updated from editor');
  });

  it('refreshes the preview when the value changes', async () => {
    renderMarkdownMock
      .mockResolvedValueOnce('<p>first</p>')
      .mockResolvedValueOnce('<p>second</p>');

    await act(async () => {
      root.render(<MarkdownField value="first value" onChange={() => {}} />);
    });
    await flushEffects();

    await act(async () => {
      root.render(<MarkdownField value="second value" onChange={() => {}} />);
    });
    await flushEffects();

    expect(renderMarkdownMock).toHaveBeenNthCalledWith(1, 'first value');
    expect(renderMarkdownMock).toHaveBeenNthCalledWith(2, 'second value');
    expect(container.querySelector('.wmde-markdown')?.innerHTML).toContain('<p>second</p>');
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<MarkdownField value="**hello**" onChange={() => {}} label="Body" />);
    });
    await flushEffects();

    await expectAccessible(container);
  });
});
