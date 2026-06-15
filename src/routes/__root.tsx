import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { useCurrentPlayer, setCurrentPlayer } from "../lib/current-player";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-neon">404</h1>
        <p className="mt-4 text-muted-foreground">Off the pitch. Page not found.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-neon px-4 py-2 text-primary-foreground font-semibold"
        >
          Back to lobby
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-4 rounded-md bg-neon px-4 py-2 text-primary-foreground font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FIFA Fantasy Picks" },
      {
        name: "description",
        content: "Pick winners across 104 FIFA matches and climb the leaderboard.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function Nav() {
  const player = useCurrentPlayer();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/thumb/1/17/2026_FIFA_World_Cup_emblem.svg/250px-2026_FIFA_World_Cup_emblem.svg.png" 
            alt="FIFA 2026 Emblem" 
            className="inline-block h-7 w-7 object-contain" 
          />
          <span className="display text-2xl tracking-wider">FIFA FANTASY</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/matches"
            className="px-3 py-1.5 rounded-md hover:bg-secondary"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-secondary text-neon" }}
          >
            Matches
          </Link>
          <Link
            to="/leaderboard"
            className="px-3 py-1.5 rounded-md hover:bg-secondary"
            activeProps={{ className: "px-3 py-1.5 rounded-md bg-secondary text-neon" }}
          >
            Leaderboard
          </Link>
          {player?.is_admin && (
            <Link
              to="/settings"
              className="px-3 py-1.5 rounded-md hover:bg-secondary"
              activeProps={{ className: "px-3 py-1.5 rounded-md bg-secondary text-neon" }}
            >
              Scoring
            </Link>
          )}
        </nav>
        {player ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline text-muted-foreground">Playing as</span>
            <span className="font-semibold text-neon">{player.name}</span>
            {player.group_code && (
              <span className="hidden sm:inline font-mono text-xs bg-neon/10 text-neon border border-neon/30 rounded px-2 py-0.5 tracking-widest">
                {player.group_code}
              </span>
            )}
            <button
              onClick={() => setCurrentPlayer(null)}
              className="ml-1 text-xs text-muted-foreground hover:text-foreground"
            >
              switch
            </button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Not signed in</div>
        )}
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <Toaster richColors theme="dark" />
    </QueryClientProvider>
  );
}
