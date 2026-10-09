// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  uploadImageMock,
  replaceImageMock,
  deleteImageMock,
} = vi.hoisted(() => ({
  uploadImageMock: vi.fn(),
  replaceImageMock: vi.fn(),
  deleteImageMock: vi.fn(),
}));

vi.mock('../../../lib/storage', () => ({
  uploadImage: uploadImageMock,
  replaceImage: replaceImageMock,
  deleteImage: deleteImageMock,
}));

import { ImageUpload } from './ImageUpload';
import { expectAccessible } from '../../../test/axe';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('ImageUpload', () => {
  let container: HTMLDivElement;
  let root: Root;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    onChange = vi.fn();
    uploadImageMock.mockResolvedValue({
      url: 'https://example.com/storage/v1/object/public/public-assets/projects/new-image.png',
      error: null,
    });
    replaceImageMock.mockResolvedValue({
      url: 'https://example.com/storage/v1/object/public/public-assets/projects/replaced-image.png',
      error: null,
    });
    deleteImageMock.mockResolvedValue({ error: null });

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

  it('uploads a new image and reports the returned URL', async () => {
    await act(async () => {
      root.render(<ImageUpload value={null} folder="projects" onChange={onChange} />);
    });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['abc'], 'hero.png', { type: 'image/png' });

    await act(async () => {
      Object.defineProperty(input, 'files', {
        configurable: true,
        value: [file],
      });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await flushEffects();

    expect(uploadImageMock).toHaveBeenCalledWith('projects', file);
    expect(onChange).toHaveBeenCalledWith(
      'https://example.com/storage/v1/object/public/public-assets/projects/new-image.png'
    );
  });

  it('replaces an existing image when a new file is chosen', async () => {
    await act(async () => {
      root.render(
        <ImageUpload
          value="https://example.com/storage/v1/object/public/public-assets/projects/old-image.png"
          folder="projects"
          onChange={onChange}
        />
      );
    });

    const replaceButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Replace')
    ) as HTMLButtonElement;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['abc'], 'replacement.png', { type: 'image/png' });

    await act(async () => {
      replaceButton.click();
      Object.defineProperty(input, 'files', {
        configurable: true,
        value: [file],
      });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await flushEffects();

    expect(replaceImageMock).toHaveBeenCalledWith(
      'projects',
      'https://example.com/storage/v1/object/public/public-assets/projects/old-image.png',
      file
    );
    expect(onChange).toHaveBeenCalledWith(
      'https://example.com/storage/v1/object/public/public-assets/projects/replaced-image.png'
    );
  });

  it('removes an existing image and clears the field', async () => {
    await act(async () => {
      root.render(
        <ImageUpload
          value="https://example.com/storage/v1/object/public/public-assets/projects/old-image.png"
          folder="projects"
          onChange={onChange}
        />
      );
    });

    const removeButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Remove')
    ) as HTMLButtonElement;

    await act(async () => {
      removeButton.click();
    });
    await flushEffects();

    expect(deleteImageMock).toHaveBeenCalledWith(
      'https://example.com/storage/v1/object/public/public-assets/projects/old-image.png'
    );
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('shows upload errors and offers a retry action', async () => {
    uploadImageMock.mockResolvedValue({
      url: null,
      error: 'File too large. Maximum size: 5MB',
    });

    await act(async () => {
      root.render(<ImageUpload value={null} folder="projects" onChange={onChange} />);
    });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['abc'], 'hero.png', { type: 'image/png' });

    await act(async () => {
      Object.defineProperty(input, 'files', {
        configurable: true,
        value: [file],
      });
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await flushEffects();

    expect(container.textContent).toContain('File too large. Maximum size: 5MB');
    const retryButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Try again')
    ) as HTMLButtonElement;
    expect(retryButton).toBeTruthy();
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<ImageUpload value={null} folder="projects" onChange={onChange} />);
    });

    await expectAccessible(container);
  });
});
