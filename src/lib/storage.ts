import { runProtectedAdminAction } from './admin-security';
import { getSupabaseAuth } from './supabase-auth';

const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

const ALLOWED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
] as const;

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024;
const PUBLIC_ASSETS_BUCKET = 'public-assets';

type ImageFolder = 'projects' | 'news' | 'publications' | 'people' | 'partners';
type VideoFolder = 'projects';

function protectedStorageAction<T>(key: string, action: () => Promise<T>): Promise<T> {
  return runProtectedAdminAction(
    {
      key,
      limit: 10,
      windowMs: 10 * 60 * 1000,
      cooldownMs: 2_000,
      message: 'Too many file operations were submitted too quickly.',
    },
    action
  );
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9.-]/g, '');
}

function extractPublicAssetsPath(publicUrl: string): string | null {
  const prefix = `/${PUBLIC_ASSETS_BUCKET}/`;
  const idx = publicUrl.indexOf(prefix);
  if (idx === -1) return null;
  const path = publicUrl.slice(idx + prefix.length).split('?')[0];
  return path || null;
}

async function uploadAsset(
  kind: 'image' | 'video',
  folder: ImageFolder | VideoFolder,
  file: File,
  allowedMimeTypes: readonly string[],
  maxFileSize: number
): Promise<{ url: string | null; error: string | null }> {
  if (!allowedMimeTypes.includes(file.type)) {
    return { url: null, error: `Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}` };
  }
  if (file.size > maxFileSize) {
    return { url: null, error: `File too large. Maximum size: ${maxFileSize / 1024 / 1024}MB` };
  }

  const sanitized = sanitizeFilename(file.name);
  const filename = `${Date.now()}-${sanitized || kind}`;
  const path = kind === 'image' ? `${folder}/${filename}` : `${folder}/videos/${filename}`;

  try {
    const { error } = await protectedStorageAction(`upload-${kind}:${folder}`, () =>
      getSupabaseAuth().storage.from(PUBLIC_ASSETS_BUCKET).upload(path, file)
    );
    if (error) {
      return { url: null, error: error.message };
    }
  } catch (error) {
    return { url: null, error: error instanceof Error ? error.message : `Unable to upload ${kind}.` };
  }

  const { data } = getSupabaseAuth().storage.from(PUBLIC_ASSETS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}

async function deleteAsset(
  kind: 'image' | 'video',
  publicUrl: string
): Promise<{ error: string | null }> {
  const path = extractPublicAssetsPath(publicUrl);
  if (!path) {
    return { error: 'Invalid storage URL: cannot extract path' };
  }

  try {
    const { error } = await protectedStorageAction(`delete-${kind}:${path}`, () =>
      getSupabaseAuth().storage.from(PUBLIC_ASSETS_BUCKET).remove([path])
    );
    return error ? { error: error.message } : { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : `Unable to delete ${kind}.` };
  }
}

export function isPublicAssetsUrl(publicUrl: string | null | undefined): publicUrl is string {
  return Boolean(publicUrl && extractPublicAssetsPath(publicUrl));
}

export async function uploadImage(
  folder: ImageFolder,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  return uploadAsset('image', folder, file, ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_FILE_SIZE);
}

export async function deleteImage(
  publicUrl: string
): Promise<{ error: string | null }> {
  return deleteAsset('image', publicUrl);
}

export async function replaceImage(
  folder: ImageFolder,
  oldUrl: string | null,
  newFile: File
): Promise<{ url: string | null; error: string | null }> {
  // Upload first so a failed upload does not delete the existing asset.
  const uploaded = await uploadImage(folder, newFile);
  if (uploaded.error || !uploaded.url) {
    return uploaded;
  }
  if (oldUrl && isPublicAssetsUrl(oldUrl) && oldUrl !== uploaded.url) {
    await deleteImage(oldUrl);
  }
  return uploaded;
}

export async function uploadVideo(
  folder: VideoFolder,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  return uploadAsset('video', folder, file, ALLOWED_VIDEO_MIME_TYPES, MAX_VIDEO_FILE_SIZE);
}

export async function deleteVideo(
  publicUrl: string
): Promise<{ error: string | null }> {
  return deleteAsset('video', publicUrl);
}

export async function replaceVideo(
  folder: VideoFolder,
  oldUrl: string | null,
  newFile: File
): Promise<{ url: string | null; error: string | null }> {
  // Upload first so a failed upload does not delete the existing asset.
  const uploaded = await uploadVideo(folder, newFile);
  if (uploaded.error || !uploaded.url) {
    return uploaded;
  }
  if (oldUrl && isPublicAssetsUrl(oldUrl) && oldUrl !== uploaded.url) {
    await deleteVideo(oldUrl);
  }
  return uploaded;
}




