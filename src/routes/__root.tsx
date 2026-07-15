import { Suspense, useEffect } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";

import { AppProviders } from "../context/AppProviders.jsx";
import { reportLovableError } from "../lib/lovable-error-reporting";

import Navbar from "../components/ui/Navbar.jsx";
import Footer from "../components/ui/Footer.jsx";
import FloatingContactButtons from "../components/ui/FloatingContactButtons.jsx";
import CartDrawer from "../components/ui/CartDrawer.jsx";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>

        <h2 className="mt-4 text-xl font-semibold">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <div className="mt-6">
          <a
            href="/"
            className="btn-gold inline-flex rounded-full px-6 py-2.5 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "root",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">
          Something went wrong
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>

        <div className="mt-6">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-gold rounded-full px-6 py-2.5 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route =
  createRootRouteWithContext<{
    queryClient: QueryClient;
  }>()({
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
  });

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    document.title = "Maison Noir — Premium Fashion Kenya";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <div className="min-h-screen bg-background text-foreground flex flex-col">

          {!isAdmin && <Navbar />}

          <main className="flex-1">
            <Suspense fallback={<LoadingSpinner />}>
              <Outlet />
            </Suspense>
          </main>

          {!isAdmin && <Footer />}
          {!isAdmin && <CartDrawer />}
          {!isAdmin && <FloatingContactButtons />}

        </div>
      </AppProviders>
    </QueryClientProvider>
  );
}