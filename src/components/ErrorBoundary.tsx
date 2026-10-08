import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Unexpected ecosystem rendering error.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Aetheria ErrorBoundary caught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('aetheria_solarpunk_state_2027_v1');
    } catch {
      // ignore storage errors
    }
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F1EA] text-[#1E293B] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FAF8F3] border border-[#1E293B]/15 rounded-2xl p-8 space-y-5">
            <div className="flex items-center gap-3 text-[#D97706]">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h1 className="text-xl font-semibold text-[#1E293B]">
                Sanctuary Safe-Mode Recovery
              </h1>
            </div>
            <p className="text-sm text-[#1E293B]/80 leading-relaxed">
              Aetheria intercepted a client-side rendering issue so your session never hits a blank screen. Your core ledger can be safely re-initialized below.
            </p>
            <div className="p-3 bg-[#F4F1EA] border border-[#1E293B]/10 rounded-lg text-xs font-mono text-[#1E293B]/70 break-words">
              {this.state.errorMessage}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => this.setState({ hasError: false, errorMessage: '' })}
                className="px-4 py-2 text-xs font-semibold bg-[#2D5A27] text-white rounded-lg hover:bg-[#23471E] transition-colors whitespace-nowrap"
              >
                Retry Render
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 text-xs font-semibold border border-[#1E293B]/20 text-[#1E293B] rounded-lg hover:bg-[#1E293B]/5 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Local State
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
