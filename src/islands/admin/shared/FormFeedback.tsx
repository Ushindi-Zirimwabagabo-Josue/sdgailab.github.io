interface FormFeedbackProps {
  message: string | null;
  type: 'success' | 'error';
}

export function FormFeedback({ message, type }: FormFeedbackProps) {
  if (!message?.trim()) return null;

  const styles =
    type === 'success'
      ? 'bg-green-50 text-green-700 border border-green-200'
      : 'bg-red-500/10 text-red-200 border border-red-500/30';

  return (
    <div className={`rounded-md p-3 text-sm my-3 ${styles}`} role="alert">
      {message}
    </div>
  );
}
