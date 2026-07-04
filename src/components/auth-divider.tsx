import { cn } from "@/lib/utils";

type AuthDividerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AuthDivider({ children, className }: AuthDividerProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-card px-2 text-muted-foreground">{children}</span>
      </div>
    </div>
  );
}
