// Tiny CSV export helper (no dependency).
function esc(v) {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
export function toCSV(rows, headers) {
  if (!rows?.length) return (headers || []).join(",");
  const cols = headers || Object.keys(rows[0]);
  const out = [cols.join(",")];
  rows.forEach((r) => out.push(cols.map((c) => esc(r[c])).join(",")));
  return out.join("\n");
}
export function downloadCSV(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}