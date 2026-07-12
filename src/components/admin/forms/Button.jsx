import clsx from "clsx";

export default function Button({
  children,
  loading = false,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-yellow-500 text-black hover:bg-yellow-400",

    secondary:
      "bg-gray-800 text-white hover:bg-gray-700",

    danger:
      "bg-red-600 text-white hover:bg-red-500",

    outline:
      "border border-gray-300 bg-white hover:bg-gray-100",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "rounded-lg px-5 py-3 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}