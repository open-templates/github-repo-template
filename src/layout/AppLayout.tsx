import { Outlet } from "react-router";
import { AppHeader } from "@/layout/AppHeader";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
