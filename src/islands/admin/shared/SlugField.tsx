import { useEffect, useRef } from 'react';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export interface SlugFieldProps {
  value: string;
  sourceValue: string;
  onChange: (slug: string) => void;
  label?: string;
}

export function SlugField({
  value,
  sourceValue,
  onChange,
  label = 'Slug',
}: SlugFieldProps) {
  const manuallyEditedRef = useRef(false);
  const prevSourceRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const prev = prevSourceRef.current;
    const newSlug = slugify(sourceValue);

    if (prev !== undefined) {
      const slugFromPrev = slugify(prev);
      if (value === slugFromPrev) {
        manuallyEditedRef.current = false;
        onChange(newSlug);
      }
    } else {
      if (value === newSlug || value === '') {
        manuallyEditedRef.current = false;
        onChange(newSlug);
      } else {
        manuallyEditedRef.current = true;
      }
    }
    prevSourceRef.current = sourceValue;
  }, [sourceValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    manuallyEditedRef.current = true;
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="slug-field" className="block text-sm font-medium text-lab-text mb-1">
        {label}
      </label>
      <input
        id="slug-field"
        type="text"
        value={value}
        onChange={handleChange}
        className="w-full border rounded-md px-3 py-2 text-sm border-lab-border focus:outline-none focus:ring-2 focus:ring-lab-accent focus:border-lab-accent"
      />
      <span className="text-xs text-lab-muted block mt-1">Slug: /{value}</span>
    </div>
  );
}
