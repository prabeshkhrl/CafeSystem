import { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in dev — swap for Sentry/LogRocket later
    console.error("[ErrorBoundary]", error, errorInfo);

    this.setState({ errorInfo });

    // Optional: send to error reporting service
    // Sentry.captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDev = import.meta.env.DEV;

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-white">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            We hit an unexpected error. Try reloading the page — if the
            problem continues, please contact support.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-sm px-5 py-3 rounded-full shadow-md hover:shadow-lg transition"
            >
              <RefreshCw className="w-4 h-4" />
              Reload page
            </button>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "/";
              }}
              className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 font-semibold text-sm px-5 py-3 rounded-full hover:border-orange-300 hover:text-orange-600 transition"
            >
              <Home className="w-4 h-4" />
              Go home
            </a>
          </div>

          {/* Dev-only technical details */}
          {isDev && this.state.error && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-600 select-none">
                Technical details (dev only)
              </summary>
              <div className="mt-3 p-4 rounded-xl bg-gray-50 border border-gray-200 text-left overflow-auto max-h-64">
                <p className="text-xs font-bold text-red-600 mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-gray-600 whitespace-pre-wrap font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }
}