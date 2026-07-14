// components/Card.jsx
export function Card({ title, value, icon }) {
  return (
    <div className="rounded-xl border border-amber-400/20 bg-[#1a1a1a] p-4 hover:border-amber-400/40 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        {icon && <div className="text-amber-400">{icon}</div>}
      </div>
    </div>
  );
}