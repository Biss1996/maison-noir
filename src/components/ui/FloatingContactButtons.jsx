import { motion } from "framer-motion";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { useState } from "react";

const items = [
  { icon: FaWhatsapp, label: "WhatsApp", href: "https://wa.me/254700000000", color: "#25D366" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com", color: "#E1306C" },
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com", color: "#1877F2" },
  { icon: FaPhoneAlt, label: "Call", href: "tel:+254700000000", color: "#c9a24a" },
];

export default function FloatingContactButtons() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && items.map((it, i) => (
        <motion.a
          key={it.label} href={it.href} target="_blank" rel="noreferrer"
          initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.05 }}
          className="grid place-items-center h-11 w-11 rounded-full text-white shadow-luxe"
          style={{ background: it.color }} aria-label={it.label}
        >
          <it.icon />
        </motion.a>
      ))}
      <motion.button
        whileTap={{ scale: 0.9 }} onClick={() => setOpen((o) => !o)}
        className="btn-gold grid place-items-center h-14 w-14 rounded-full shadow-luxe font-semibold"
        aria-label="Contact us"
      >
        {open ? "×" : "?"}
      </motion.button>
    </div>
  );
}
