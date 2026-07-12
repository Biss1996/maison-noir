export default function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="h-10 w-10 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  );
}
