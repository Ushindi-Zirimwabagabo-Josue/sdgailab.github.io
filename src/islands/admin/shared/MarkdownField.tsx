import { useEffect, useState } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { renderMarkdown } from '../../../lib/markdown';

interface MarkdownFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const simplifiedCommands = [
  commands.bold,
  commands.italic,
  commands.title1,
  commands.title2,
  commands.title3,
  commands.divider,
  commands.link,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.divider,
  commands.image,
  commands.codePreview,
];

function SafeMarkdownPreview({ source }: { source: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    renderMarkdown(source).then(setHtml);
  }, [source]);

  return <div className="wmde-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MarkdownField({
  value,
  onChange,
  label = 'Content',
}: MarkdownFieldProps) {
  return (
    <div data-color-mode="dark" className="mb-4">
      {label && (
        <label className="mb-2 block text-sm font-medium text-lab-text">
          {label}
        </label>
      )}
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? '')}
        height={420}
        preview="live"
        highlightEnable={false}
        commands={simplifiedCommands}
        components={{
          preview: (source) => <SafeMarkdownPreview source={source} />,
        }}
      />
    </div>
  );
}
