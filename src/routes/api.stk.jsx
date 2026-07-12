import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/stk")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { phone, amount, reference } = await request.json();
          if (!phone || !amount) return Response.json({ error: "phone and amount required" }, { status: 400 });

          const url = process.env.VITE_HASHPAY_URL || "https://api.hashpay.co.ke";
          const apiKey = process.env.HASHPAY_API_KEY;
          const accountId = process.env.HASHPAY_ACCOUNT_ID;

          if (!apiKey || !accountId) {
            // Dev fallback: pretend to initiate so the UI can be tested without live credentials.
            return Response.json({
              ok: true, mock: true,
              checkoutId: `MOCK-${Date.now()}`,
              message: "HashPay credentials not configured — mock response. Set HASHPAY_API_KEY and HASHPAY_ACCOUNT_ID.",
            });
          }

          const res = await fetch(`${url}/stk/push`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
            body: JSON.stringify({ account_id: accountId, phone, amount, reference: reference || `MN-${Date.now()}` }),
          });
          const data = await res.json();
          if (!res.ok) return Response.json({ error: data.message || "HashPay error", detail: data }, { status: 502 });
          return Response.json(data);
        } catch (e) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      },
    },
  },
});
