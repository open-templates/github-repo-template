import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  detailsOpen: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      detailsOpen: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, detailsOpen: false });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ detailsOpen: !prev.detailsOpen }));
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const title = i18n.t("errorBoundary.title", "Something went wrong");
      const description = i18n.t(
        "errorBoundary.description",
        "An unexpected error occurred. Please try refreshing the page."
      );
      const reloadButton = i18n.t("errorBoundary.reload", "Reload page");
      const tryAgainButton = i18n.t("errorBoundary.tryAgain", "Try again");
      const showDetails = i18n.t("errorBoundary.showDetails", "Show details");
      const hideDetails = i18n.t("errorBoundary.hideDetails", "Hide details");

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
          <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangleIcon className="h-12 w-12 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={this.handleReload} variant="default">
                <RefreshCwIcon className="mr-2 h-4 w-4" />
                {reloadButton}
              </Button>
              <Button onClick={this.handleReset} variant="outline">
                {tryAgainButton}
              </Button>
            </div>
            {import.meta.env.DEV && this.state.errorInfo && (
              <div className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={this.toggleDetails}
                >
                  {this.state.detailsOpen ? hideDetails : showDetails}
                </Button>
                {this.state.detailsOpen && (
                  <pre className="mt-4 max-h-48 overflow-auto rounded-md border bg-muted p-4 text-left text-xs">
                    {this.state.error.toString()}
                    {"\n\n"}
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
