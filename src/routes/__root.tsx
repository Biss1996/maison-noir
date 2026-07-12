import { Suspense } from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProviders } from "../context/AppProviders.jsx";
import Navbar from "../components/ui/Navbar.jsx";
import Footer from "../components/ui/Footer.jsx";
import FloatingContactButtons from "../components/ui/FloatingContactButtons.jsx";
import CartDrawer from "../components/ui/CartDrawer.jsx";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <a href="/" className="btn-gold inline-flex rounded-full px-6 py-2.5 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold rounded-full px-6 py-2.5 text-sm font-medium">Try again</button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Maison Noir — Premium Fashion Kenya" },
      { name: "description", content: "Curated luxury fashion from Kenya's finest designers. Free delivery over KSh 5,000. Pay with M-Pesa via HashPay." },
      { name: "author", content: "Maison Noir" },
      { property: "og:title", content: "Maison Noir — Premium Fashion Kenya" },
      { property: "og:description", content: "Curated luxury fashion from Kenya's finest designers. Free delivery over KSh 5,000. Pay with M-Pesa via HashPay." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Maison Noir — Premium Fashion Kenya" },
      { name: "twitter:description", content: "Curated luxury fashion from Kenya's finest designers. Free delivery over KSh 5,000. Pay with M-Pesa via HashPay." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6878ed97-abbe-49d7-ac2e-bd7f04a129bc/id-preview-b111db6c--1b6832f4-f35a-427f-9886-986bfd6dbeb4.lovable.app-1783408359607.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6878ed97-abbe-49d7-ac2e-bd7f04a129bc/id-preview-b111db6c--1b6832f4-f35a-427f-9886-986bfd6dbeb4.lovable.app-1783408359607.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" },
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
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
  <Suspense fallback={<LoadingSpinner />}>
    <Outlet />
  </Suspense>
</main>
          <Footer />
        </div>
        <CartDrawer />
        <FloatingContactButtons />
      </AppProviders>
    </QueryClientProvider>
  );
}
