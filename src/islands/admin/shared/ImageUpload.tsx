import { useRef, useState } from 'react';
import { uploadImage, deleteImage, replaceImage } from '../../../lib/storage';

export interface ImageUploadProps {
  value: string | null;
  folder: 'projects' | 'news' | 'publications' | 'people' | 'partners';
  onChange: (url: string | null) => void;
  label?: string;
}

export function ImageUpload({
  value,
  folder,
  onChange,
  label = 'Image',
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setError(null);
    setLoading(true);

    try {
      let result: { url: string | null; error: string | null };
      if (value) {
        result = await replaceImage(folder, value, file);
      } else {
        result = await uploadImage(folder, file);
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
      const { error: err } = await deleteImage(value);
      if (err) {
        setError(err);
      } else {
        onChange(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-lab-text mb-1">{label}</label>

      {value ? (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <img
              src={value}
              alt="Upload preview"
              className="max-h-32 rounded object-cover"
            />
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleReplace}
                disabled={loading}
                className="px-3 py-2 text-sm border border-lab-border rounded-md hover:bg-lab-base disabled:opacity-50"
              >
                Replace
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
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="w-full border-2 border-dashed border-lab-border rounded-md px-4 py-8 text-sm text-lab-muted hover:border-lab-accent/50 hover:bg-lab-base disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? 'Uploading…' : 'Choose image to upload'}
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
        aria-label={label}
      />

      {error && (
        <div className="mt-2 text-sm text-red-300" role="alert">
          {error}{' '}
          <button
            type="button"
            onClick={() => (value ? handleReplace() : inputRef.current?.click())}
            className="underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
