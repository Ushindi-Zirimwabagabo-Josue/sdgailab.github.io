import { useRef, useState } from 'react';
import { deleteVideo, isPublicAssetsUrl, replaceVideo, uploadVideo } from '../../../lib/storage';

export interface VideoUploadProps {
  value: string | null;
  folder: 'projects';
  onChange: (url: string | null) => void;
  label?: string;
}

export function VideoUpload({
  value,
  folder,
  onChange,
  label = 'Video upload',
}: VideoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isManagedVideo = isPublicAssetsUrl(value);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setError(null);
    setLoading(true);

    try {
      let result: { url: string | null; error: string | null };
      if (value) {
        result = await replaceVideo(folder, value, file);
      } else {
        result = await uploadVideo(folder, file);
      }

      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        onChange(result.url);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    setError(null);
    setLoading(true);

    try {
      if (isManagedVideo) {
        const { error: err } = await deleteVideo(value);
        if (err) {
          setError(err);
          return;
        }
      }
      onChange(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-lab-text mb-1">{label}</label>

      {value ? (
        <div className="space-y-3 rounded-md border border-lab-border bg-lab-base p-3">
          {isManagedVideo ? (
            <video src={value} className="max-h-40 w-full rounded bg-black" controls preload="metadata" />
          ) : (
            <p className="break-all text-xs text-lab-muted">
              Current external video URL: <span className="font-medium">{value}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleChoose}
              disabled={loading}
              className="px-3 py-2 text-sm border border-lab-border rounded-md hover:bg-lab-surface disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload replacement'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="px-3 py-2 text-sm border border-red-500/40 text-red-200 rounded-md hover:bg-red-500/10 disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleChoose}
          disabled={loading}
          className="w-full border-2 border-dashed border-lab-border rounded-md px-4 py-8 text-sm text-lab-muted hover:border-lab-accent/50 hover:bg-lab-base disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? 'Uploading...' : 'Choose video to upload'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.ogg,.mov"
        onChange={handleFileSelect}
        className="hidden"
        aria-label={label}
      />

      <p className="mt-2 text-xs text-lab-muted">
        Upload MP4, WebM, OGG or MOV. Recommended: compressed MP4 under 100MB.
      </p>

      {error && (
        <div className="mt-2 text-sm text-red-300" role="alert">
          {error}{' '}
          <button type="button" onClick={handleChoose} className="underline hover:no-underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
