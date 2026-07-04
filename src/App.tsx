import { Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Loader2Icon } from "lucide-react";
import { AuthProvider } from "@/auth/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthGuard } from "@/auth/AuthGuard";
import { ErrorBoundary } from "@/components/error-boundary";
import { RouteErrorFallback } from "@/components/error-router-fallback";
import { Toaster } from "sonner";
import { AppLayout } from "@/layout/AppLayout";

import LogInPage from "@/auth/pages/LogInPage";
import SignUpPage from "@/auth/pages/SignUpPage";
import RecoverPasswordPage from "@/auth/pages/RecoverPasswordPage";
import ResetPasswordPage from "@/auth/pages/ResetPasswordPage";
import HomePage from "@/pages/HomePage";

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: "/",
        element: (
          <AuthGuard requireAuth>
            <HomePage />
          </AuthGuard>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthGuard requireAuth={false}>
            <LogInPage />
          </AuthGuard>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthGuard requireAuth={false}>
            <SignUpPage />
          </AuthGuard>
        ),
      },
      {
        path: "/recover-password",
        element: (
          <AuthGuard requireAuth={false}>
            <RecoverPasswordPage />
          </AuthGuard>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <AuthGuard requireAuth>
            <ResetPasswordPage />
          </AuthGuard>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Toaster position="top-right" richColors />
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
