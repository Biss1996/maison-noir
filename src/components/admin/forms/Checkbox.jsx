export default function Checkbox({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-yellow-500"
      />

      <span>{label}</span>
    </label>
  );
}