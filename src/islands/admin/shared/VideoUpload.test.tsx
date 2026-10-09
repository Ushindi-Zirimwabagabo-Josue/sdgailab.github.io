// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const {
  uploadVideoMock,
  replaceVideoMock,
  deleteVideoMock,
  isPublicAssetsUrlMock,
} = vi.hoisted(() => ({
  uploadVideoMock: vi.fn(),
  replaceVideoMock: vi.fn(),
  deleteVideoMock: vi.fn(),
  isPublicAssetsUrlMock: vi.fn((url: string | null | undefined) =>
    Boolean(url && url.includes('/public-assets/'))
  ),
}));

vi.mock('../../../lib/storage', () => ({
  uploadVideo: uploadVideoMock,
  replaceVideo: replaceVideoMock,
  deleteVideo: deleteVideoMock,
  isPublicAssetsUrl: isPublicAssetsUrlMock,
}));

import { VideoUpload } from './VideoUpload';
import { expectAccessibleSmoke } from '../../../test/axe';

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function chooseFile(input: HTMLInputElement, file: File) {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: [file],
  });
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('VideoUpload', () => {
  let container: HTMLDivElement;
  let root: Root;
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    vi.clearAllMocks();
    onChange = vi.fn();
    isPublicAssetsUrlMock.mockImplementation((url: string | null | undefined) =>
      Boolean(url && url.includes('/public-assets/'))
    );
    uploadVideoMock.mockResolvedValue({
      url: 'https://example.com/storage/v1/object/public/public-assets/projects/videos/new.mp4',
      error: null,
    });
    replaceVideoMock.mockResolvedValue({
      url: 'https://example.com/storage/v1/object/public/public-assets/projects/videos/replaced.mp4',
      error: null,
    });
    deleteVideoMock.mockResolvedValue({ error: null });

    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('uploads a new video and reports the returned URL', async () => {
    await act(async () => {
      root.render(<VideoUpload value={null} folder="projects" onChange={onChange} />);
    });

    const chooseButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Choose video to upload')
    ) as HTMLButtonElement;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    await act(async () => {
      chooseButton.click();
      chooseFile(input, file);
    });
    await flushEffects();

    expect(uploadVideoMock).toHaveBeenCalledWith('projects', file);
    expect(onChange).toHaveBeenCalledWith(
      'https://example.com/storage/v1/object/public/public-assets/projects/videos/new.mp4'
    );
  });

  it('replaces an existing managed video', async () => {
    await act(async () => {
      root.render(
        <VideoUpload
          value="https://example.com/storage/v1/object/public/public-assets/projects/videos/old.mp4"
          folder="projects"
          onChange={onChange}
        />
      );
    });

    const replaceButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Upload replacement')
    ) as HTMLButtonElement;
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['video'], 'next.webm', { type: 'video/webm' });

    await act(async () => {
      replaceButton.click();
      chooseFile(input, file);
    });
    await flushEffects();

    expect(replaceVideoMock).toHaveBeenCalledWith(
      'projects',
      'https://example.com/storage/v1/object/public/public-assets/projects/videos/old.mp4',
      file
    );
    expect(onChange).toHaveBeenCalledWith(
      'https://example.com/storage/v1/object/public/public-assets/projects/videos/replaced.mp4'
    );
  });

  it('removes a managed video via storage delete', async () => {
    await act(async () => {
      root.render(
        <VideoUpload
          value="https://example.com/storage/v1/object/public/public-assets/projects/videos/old.mp4"
          folder="projects"
          onChange={onChange}
        />
      );
    });

    const removeButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Remove')
    ) as HTMLButtonElement;

    await act(async () => {
      removeButton.click();
    });
    await flushEffects();

    expect(deleteVideoMock).toHaveBeenCalledWith(
      'https://example.com/storage/v1/object/public/public-assets/projects/videos/old.mp4'
    );
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('clears an external video URL without calling storage delete', async () => {
    isPublicAssetsUrlMock.mockReturnValue(false);

    await act(async () => {
      root.render(
        <VideoUpload
          value="https://cdn.example.com/external.mp4"
          folder="projects"
          onChange={onChange}
        />
      );
    });

    expect(container.textContent).toContain('Current external video URL');
    const removeButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Remove')
    ) as HTMLButtonElement;

    await act(async () => {
      removeButton.click();
    });
    await flushEffects();

    expect(deleteVideoMock).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('shows upload errors and offers retry', async () => {
    uploadVideoMock.mockResolvedValue({
      url: null,
      error: 'File too large. Maximum size: 100MB',
    });

    await act(async () => {
      root.render(<VideoUpload value={null} folder="projects" onChange={onChange} />);
    });

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    await act(async () => {
      chooseFile(input, file);
    });
    await flushEffects();

    expect(container.textContent).toContain('File too large. Maximum size: 100MB');
    expect(
      Array.from(container.querySelectorAll('button')).some((button) =>
        button.textContent?.includes('Try again')
      )
    ).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('has no detectable accessibility violations', async () => {
    await act(async () => {
      root.render(<VideoUpload value={null} folder="projects" onChange={onChange} />);
    });

    await expectAccessibleSmoke(container);
  });
});
