import clsx from "clsx";

export default function Textarea({
  label,
  error,
  rows = 4,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        {...props}
        className={clsx(
          "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition",
          "focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300",
          error && "border-red-500",
          className
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}