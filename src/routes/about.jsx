import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/about")({ component: About });
function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">About Us</p>
      <h1 className="mt-2 font-display text-5xl">Style, considered.</h1>
      <p className="mt-6 text-muted-foreground leading-relaxed">
        Maison Noir is a Nairobi-born fashion house committed to curating premium pieces from Kenya's most talented designers.
        We believe in quality over quantity, timeless silhouettes, and materials that age beautifully.
      </p>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Every piece we carry is authenticated, ethically sourced, and shipped with care across Kenya and East Africa.
      </p>
    </div>
  );
}
