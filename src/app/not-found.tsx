import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C0A09] flex flex-col items-center justify-center gap-6 px-4">
      <div className="text-center space-y-2">
        <p className="text-8xl font-black text-stone-800">404</p>
        <h1 className="text-2xl font-black text-stone-100">Page not found</h1>
        <p className="text-xs text-stone-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="h-10 px-5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl flex items-center transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="h-10 px-5 border border-stone-800 text-stone-400 hover:text-stone-200 font-bold text-xs rounded-xl flex items-center transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
