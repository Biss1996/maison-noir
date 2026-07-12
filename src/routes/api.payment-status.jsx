import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment-status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return Response.json({ error: "id required" }, { status: 400 });

        const base = process.env.VITE_HASHPAY_URL || "https://api.hashpay.co.ke";
        const apiKey = process.env.HASHPAY_API_KEY;
        if (!apiKey) return Response.json({ status: "processing", mock: true });
        try {
          const res = await fetch(`${base}/stk/status/${id}`, { headers: { "Authorization": `Bearer ${apiKey}` } });
          const data = await res.json();
          return Response.json(data);
        } catch (e) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      },
    },
  },
});
