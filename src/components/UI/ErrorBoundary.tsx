import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Card, CardTitle, CardContent } from './Card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
  info: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error) {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <Card variant="glass" className="max-w-lg w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <CardTitle className="text-xl text-[#ff1744]">
              Something went wrong
            </CardTitle>
            <CardContent className="mt-4 space-y-4">
              <p className="text-sm text-[#9090b0] break-words">
                {this.state.error.message}
              </p>
              {this.state.info && (
                <details className="text-xs text-left text-[#606080] max-h-32 overflow-y-auto">
                  <summary className="cursor-pointer hover:text-[#9090b0]">
                    Stack trace
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.info.componentStack}
                  </pre>
                </details>
              )}
              <Button onClick={this.handleReset} variant="secondary">
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
