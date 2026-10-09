import { useEffect, useState, type ReactNode } from 'react';
import { loadPageCopy } from '../lib/pageCopy';
import { sectionFallback, sectionLines } from '../lib/pageSections';

type TextTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div';

interface CmsTextProps {
  page: string;
  section: string;
  as?: TextTag;
  className?: string;
  /** Render newline-separated copy as line breaks. */
  breaks?: boolean;
  /** Render **bold** markers. */
  rich?: boolean;
}

function renderRich(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderBreaks(text: string, rich: boolean): ReactNode[] {
  const lines = text.split('\n');
  return lines.flatMap((line, index) => {
    const content = rich ? renderRich(line) : line;
    return index === 0 ? [content] : [<br key={`br-${index}`} />, content];
  });
}

export default function CmsText({
  page,
  section,
  as = 'span',
  className,
  breaks = false,
  rich = false,
}: CmsTextProps) {
  const [text, setText] = useState(() => sectionFallback(page, section));

  useEffect(() => {
    let cancelled = false;
    loadPageCopy(page)
      .then((copy) => {
        const next = copy[section]?.trim();
        if (!cancelled && next) setText(next);
      })
      .catch(() => {
        /* Keep the built-in fallback copy. */
      });
    return () => {
      cancelled = true;
    };
  }, [page, section]);

  const Tag = as;
  const content = breaks || text.includes('\n') ? renderBreaks(text, rich) : rich ? renderRich(text) : text;
  return (
    <Tag className={className} style={as === 'span' ? { display: 'contents' } : undefined}>
      {content}
    </Tag>
  );
}

interface CmsLinesProps {
  page: string;
  section: string;
  lineClass?: string;
}

export function CmsLines({ page, section, lineClass }: CmsLinesProps) {
  const [text, setText] = useState(() => sectionFallback(page, section));

  useEffect(() => {
    let cancelled = false;
    loadPageCopy(page)
      .then((copy) => {
        const next = copy[section]?.trim();
        if (!cancelled && next) setText(next);
      })
      .catch(() => {
        /* Keep the built-in fallback copy. */
      });
    return () => {
      cancelled = true;
    };
  }, [page, section]);

  return (
    <>
      {sectionLines(text).map((line, index) => (
        <span key={`${index}-${line}`} className={lineClass}>
          {line}
        </span>
      ))}
    </>
  );
}

interface CmsListProps {
  page: string;
  section: string;
  className?: string;
}

export function CmsList({ page, section, className }: CmsListProps) {
  const [text, setText] = useState(() => sectionFallback(page, section));

  useEffect(() => {
    let cancelled = false;
    loadPageCopy(page)
      .then((copy) => {
        const next = copy[section]?.trim();
        if (!cancelled && next) setText(next);
      })
      .catch(() => {
        /* Keep the built-in fallback copy. */
      });
    return () => {
      cancelled = true;
    };
  }, [page, section]);

  return (
    <ul className={className}>
      {sectionLines(text).map((line, index) => (
        <li key={`${index}-${line}`}>{line}</li>
      ))}
    </ul>
  );
}
