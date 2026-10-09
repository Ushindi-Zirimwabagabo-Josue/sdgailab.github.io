import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { runProtectedAdminActionMock, bucketMock, fromMock, getSupabaseAuthMock } = vi.hoisted(() => ({
  runProtectedAdminActionMock: vi.fn(
    async <T>(_config: unknown, action: () => Promise<T> | T) => await action()
  ),
  bucketMock: {
    upload: vi.fn(),
    getPublicUrl: vi.fn(),
    remove: vi.fn(),
  },
  fromMock: vi.fn(),
  getSupabaseAuthMock: vi.fn(),
}));

fromMock.mockImplementation(() => bucketMock);
getSupabaseAuthMock.mockReturnValue({
  storage: {
    from: fromMock,
  },
});

vi.mock('./admin-security', () => ({
  runProtectedAdminAction: runProtectedAdminActionMock,
}));

vi.mock('./supabase-auth', () => ({
  getSupabaseAuth: getSupabaseAuthMock,
}));

import { deleteImage, replaceImage, replaceVideo, uploadImage, uploadVideo } from './storage';

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue(bucketMock);
    getSupabaseAuthMock.mockReturnValue({
      storage: {
        from: fromMock,
      },
    });
    bucketMock.upload.mockResolvedValue({ error: null });
    bucketMock.getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://example.com/storage/v1/object/public/public-assets/projects/123-image.png' },
    });
    bucketMock.remove.mockResolvedValue({ error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects invalid MIME types before calling storage', async () => {
    const file = new File(['abc'], 'payload.txt', { type: 'text/plain' });

    const result = await uploadImage('projects', file);

    expect(result.url).toBeNull();
    expect(result.error).toContain('Invalid file type');
    expect(runProtectedAdminActionMock).not.toHaveBeenCalled();
    expect(bucketMock.upload).not.toHaveBeenCalled();
  });

  it('rejects oversized files before calling storage', async () => {
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'hero.png', { type: 'image/png' });

    const result = await uploadImage('projects', file);

    expect(result.url).toBeNull();
    expect(result.error).toContain('File too large');
    expect(runProtectedAdminActionMock).not.toHaveBeenCalled();
  });

  it('uploads valid files and returns the public URL', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(123456);
    const file = new File(['abc'], 'My hero @2x!.png', { type: 'image/png' });

    const result = await uploadImage('projects', file);

    expect(result).toEqual({
      url: 'https://example.com/storage/v1/object/public/public-assets/projects/123-image.png',
      error: null,
    });
    expect(runProtectedAdminActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'upload-image:projects' }),
      expect.any(Function)
    );
    expect(fromMock).toHaveBeenCalledWith('public-assets');
    expect(bucketMock.upload).toHaveBeenCalledWith('projects/123456-My-hero-2x.png', file);
  });

  it('surfaces upload errors from storage', async () => {
    bucketMock.upload.mockResolvedValue({ error: { message: 'bucket write failed' } });
    const file = new File(['abc'], 'hero.png', { type: 'image/png' });

    const result = await uploadImage('projects', file);

    expect(result).toEqual({ url: null, error: 'bucket write failed' });
  });


  it('uploads valid videos into the project videos folder', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(222333);
    bucketMock.getPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://example.com/storage/v1/object/public/public-assets/projects/videos/222333-demo.mp4' },
    });
    const file = new File(['video'], 'demo.mp4', { type: 'video/mp4' });

    const result = await uploadVideo('projects', file);

    expect(result).toEqual({
      url: 'https://example.com/storage/v1/object/public/public-assets/projects/videos/222333-demo.mp4',
      error: null,
    });
    expect(runProtectedAdminActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'upload-video:projects' }),
      expect.any(Function)
    );
    expect(bucketMock.upload).toHaveBeenCalledWith('projects/videos/222333-demo.mp4', file);
  });

  it('rejects oversized videos before calling storage', async () => {
    const file = new File([new Uint8Array(100 * 1024 * 1024 + 1)], 'large.mp4', { type: 'video/mp4' });

    const result = await uploadVideo('projects', file);

    expect(result.url).toBeNull();
    expect(result.error).toContain('File too large. Maximum size: 100MB');
    expect(runProtectedAdminActionMock).not.toHaveBeenCalled();
  });

  it('replaces a managed video by uploading first then deleting the old asset', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(333444);
    const file = new File(['video'], 'new demo.webm', { type: 'video/webm' });

    const result = await replaceVideo(
      'projects',
      'https://example.com/storage/v1/object/public/public-assets/projects/videos/old-demo.mp4',
      file
    );

    expect(result.error).toBeNull();
    expect(bucketMock.upload).toHaveBeenCalledWith('projects/videos/333444-new-demo.webm', file);
    expect(bucketMock.remove).toHaveBeenCalledWith(['projects/videos/old-demo.mp4']);
    expect(bucketMock.upload.mock.invocationCallOrder[0]).toBeLessThan(
      bucketMock.remove.mock.invocationCallOrder[0]
    );
  });

  it('extracts a storage path and removes the old image', async () => {
    const result = await deleteImage(
      'https://example.com/storage/v1/object/public/public-assets/projects/123-hero.png?download=1'
    );

    expect(result).toEqual({ error: null });
    expect(runProtectedAdminActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'delete-image:projects/123-hero.png' }),
      expect.any(Function)
    );
    expect(bucketMock.remove).toHaveBeenCalledWith(['projects/123-hero.png']);
  });

  it('rejects malformed public URLs before hitting storage', async () => {
    const result = await deleteImage('https://example.com/not-public-assets/projects/123-hero.png');

    expect(result.error).toContain('cannot extract path');
    expect(runProtectedAdminActionMock).not.toHaveBeenCalled();
  });

  it('replaces an existing image by uploading first then deleting the old asset', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(987654);
    const file = new File(['abc'], 'new logo.svg', { type: 'image/svg+xml' });

    const result = await replaceImage(
      'partners',
      'https://example.com/storage/v1/object/public/public-assets/partners/old-logo.svg',
      file
    );

    expect(result.error).toBeNull();
    expect(bucketMock.upload).toHaveBeenCalledWith('partners/987654-new-logo.svg', file);
    expect(bucketMock.remove).toHaveBeenCalledWith(['partners/old-logo.svg']);
    expect(bucketMock.upload.mock.invocationCallOrder[0]).toBeLessThan(
      bucketMock.remove.mock.invocationCallOrder[0]
    );
  });

  it('keeps the old image when replacement upload fails', async () => {
    bucketMock.upload.mockResolvedValue({ error: { message: 'quota exceeded' } });
    const file = new File(['abc'], 'new logo.png', { type: 'image/png' });

    const result = await replaceImage(
      'partners',
      'https://example.com/storage/v1/object/public/public-assets/partners/old-logo.png',
      file
    );

    expect(result).toEqual({ url: null, error: 'quota exceeded' });
    expect(bucketMock.remove).not.toHaveBeenCalled();
  });
});

