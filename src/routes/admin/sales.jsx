import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/sales")({ component: () => <div><h1 className="font-display text-4xl">Sales</h1><p className="text-muted-foreground mt-2">Manually record in-store sales here (coming soon).</p></div> });
