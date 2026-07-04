import { useApiHealth } from "@/hooks/use-api-health";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import logo from "@/assets/react-supabase-auth-template-logo.png";

export function AppHeader() {
  const apiStatus = useApiHealth();
  const { user, signOut } = useAuth();

  const statusLabel =
    apiStatus === "checking"
      ? "Checking API…"
      : apiStatus === "online"
        ? "API online"
        : "API offline";

  const statusColor =
    apiStatus === "checking"
      ? "bg-yellow-500"
      : apiStatus === "online"
        ? "bg-green-500"
        : "bg-red-500";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-semibold">React Supabase Auth</span>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            title={statusLabel}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
            <span className="hidden sm:inline">{statusLabel}</span>
          </div>

          <ThemeToggle />

          {user && (
            <>
              <span className="hidden text-sm text-muted-foreground md:inline">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
