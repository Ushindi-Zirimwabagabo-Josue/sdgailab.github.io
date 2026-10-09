import { Component, type ErrorInfo, type ReactNode } from 'react';
import {
  ensureObservabilityInitialized,
  logAppError,
  type ObservabilitySurface,
} from '../../lib/observability';

interface ObservabilityBoundaryProps {
  children: ReactNode;
  surface: ObservabilitySurface;
  name: string;
}

interface ObservabilityBoundaryState {
  hasError: boolean;
}

function ErrorFallback({ name }: { name: string }) {
  return (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 text-red-700">
        The {name} view hit an unexpected error. Please refresh the page and try again.
      </p>
    </div>
  );
}

class ObservabilityBoundaryInner extends Component<
  ObservabilityBoundaryProps,
  ObservabilityBoundaryState
> {
  state: ObservabilityBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ObservabilityBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logAppError(`react.error_boundary.${this.props.name}`, error, {
      component: this.props.name,
      surface: this.props.surface,
      componentStack: info.componentStack ?? '',
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback name={this.props.name} />;
    }
    return this.props.children;
  }
}

export default function ObservabilityBoundary({
  children,
  surface,
  name,
}: ObservabilityBoundaryProps) {
  ensureObservabilityInitialized({ surface });

  return (
    <ObservabilityBoundaryInner surface={surface} name={name}>
      {children}
    </ObservabilityBoundaryInner>
  );
}
