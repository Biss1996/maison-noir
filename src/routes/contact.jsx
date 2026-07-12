import { createFileRoute } from "@tanstack/react-router";
import Swal from "sweetalert2";
export const Route = createFileRoute("/contact")({ component: Contact });
function Contact() {
  const submit = (e) => { e.preventDefault(); Swal.fire({ icon: "success", title: "Message sent", text: "We'll get back to you shortly." }); e.target.reset(); };
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-5xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">We'd love to hear from you.</p>
      <form onSubmit={submit} className="mt-8 space-y-3">
        <input required placeholder="Your name" className="w-full px-4 py-3 rounded-md border" />
        <input required type="email" placeholder="Email" className="w-full px-4 py-3 rounded-md border" />
        <textarea required rows={5} placeholder="How can we help?" className="w-full px-4 py-3 rounded-md border" />
        <button className="btn-gold px-8 py-3 rounded-full font-medium">Send</button>
      </form>
    </div>
  );
}
