export default function StatusBanner({
  message,
  type = "error",
  onDismiss,
  className = "",
}) {
  if (!message) {
    return null;
  }

  const styles =
    type === "success"
      ? "bg-green-50 border-green-300 text-green-800"
      : type === "info"
        ? "bg-blue-50 border-blue-300 text-blue-800"
        : "bg-red-50 border-red-300 text-red-800";

  const label =
    type === "success" ? "Success" : type === "info" ? "Note" : "Error";

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`border-2 rounded-xl p-4 text-sm font-bold ${styles} ${className}`.trim()}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] opacity-70">
            {label}
          </p>
          <p className="mt-1">{message}</p>
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 rounded-md px-2 py-1 text-xs font-black uppercase hover:bg-black/5"
            aria-label="Dismiss message"
          >
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
