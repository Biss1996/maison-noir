import { useEffect, useState } from "react";

export default function CountdownTimer({ target }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff / 3600000) % 24);
      const m = Math.floor((diff / 60000) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setT({ d, h, m, s });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [target]);
  const box = (n, l) => (
    <div className="text-center">
      <div className="btn-gold rounded-lg px-4 py-3 min-w-16 font-display text-3xl">{String(n).padStart(2, "0")}</div>
      <div className="text-xs mt-1 uppercase tracking-wider text-muted-foreground">{l}</div>
    </div>
  );
  return <div className="flex gap-3 justify-center">{box(t.d, "Days")}{box(t.h, "Hrs")}{box(t.m, "Min")}{box(t.s, "Sec")}</div>;
}
