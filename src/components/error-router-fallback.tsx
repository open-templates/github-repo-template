import { useState } from "react";
import { useRouteError, useNavigate, isRouteErrorResponse } from "react-router";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import i18n from "@/lib/i18n";

export function RouteErrorFallback() {
  const error = useRouteError();
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const errorMessage =
    isRouteErrorResponse(error) && error.data?.message
      ? String(error.data.message)
      : error instanceof Error
        ? error.message
        : String(error);

  const errorStack = error instanceof Error ? error.stack : undefined;

  const title = i18n.t("errorBoundary.title", "Something went wrong");
  const description = i18n.t(
    "errorBoundary.description",
    "An unexpected error occurred. Please try refreshing the page."
  );
  const reloadButton = i18n.t("errorBoundary.reload", "Reload page");
  const tryAgainButton = i18n.t("errorBoundary.tryAgain", "Try again");
  const showDetails = i18n.t("errorBoundary.showDetails", "Show details");
  const hideDetails = i18n.t("errorBoundary.hideDetails", "Hide details");

  const handleReload = () => window.location.reload();
  const handleTryAgain = () => navigate(-1);

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
          <Button onClick={handleReload} variant="default">
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            {reloadButton}
          </Button>
          <Button onClick={handleTryAgain} variant="outline">
            {tryAgainButton}
          </Button>
        </div>
        {import.meta.env.DEV && (errorStack || errorMessage) && (
          <div className="w-full">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setDetailsOpen((prev) => !prev)}
            >
              {detailsOpen ? hideDetails : showDetails}
            </Button>
            {detailsOpen && (
              <pre className="mt-4 max-h-48 overflow-auto rounded-md border bg-muted p-4 text-left text-xs">
                {errorMessage}
                {errorStack && `\n\n${errorStack}`}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
