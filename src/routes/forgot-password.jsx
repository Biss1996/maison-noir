import { createFileRoute, Link } from "@tanstack/react-router";
import Swal from "sweetalert2";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const submit = async (e) => {
    e.preventDefault();
    Swal.fire({ icon: "info", title: "Contact support", text: "Password reset for phone accounts is admin-assisted. Please contact us via WhatsApp." });
  };
  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <form onSubmit={submit} className="max-w-sm w-full">
        <h1 className="font-display text-4xl">Forgot password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter your phone number and we'll help you reset your password.</p>
        <input required placeholder="Phone number" className="mt-6 w-full px-4 py-3 rounded-md border" />
        <button className="btn-gold w-full mt-3 py-3 rounded-full">Request reset</button>
        <p className="mt-4 text-sm text-center"><Link to="/login" className="underline">Back to login</Link></p>
      </form>
    </div>
  );
}
