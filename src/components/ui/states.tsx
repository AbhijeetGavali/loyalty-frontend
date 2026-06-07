import { Loader2, AlertCircle, Inbox } from "lucide-react";

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-3">
      <Loader2 className="size-6 animate-spin text-amber-500" />
      <p className="text-xs text-stone-500">{message}</p>
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-3">
      <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertCircle className="size-5 text-rose-400" />
      </div>
      <p className="text-sm text-rose-400 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs text-stone-400 underline hover:text-stone-200 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-3">
      <div className="size-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center">
        <Icon className="size-5 text-stone-600" />
      </div>
      <p className="text-sm font-bold text-stone-500">{title}</p>
      {description && <p className="text-xs text-stone-600 text-center max-w-xs">{description}</p>}
    </div>
  );
}
