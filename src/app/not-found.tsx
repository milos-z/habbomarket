import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-habbo-card pixel-border flex items-center justify-center">
          <span className="font-[family-name:var(--font-pixel)] text-3xl text-habbo-gold pixel-text-shadow">
            404
          </span>
        </div>
        <div className="absolute inset-0 pixel-grid-bg opacity-20 rounded-2xl" />
      </div>

      <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-gold pixel-text-shadow mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-habbo-text-dim max-w-md mx-auto mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try searching for what you need or go back to the dashboard.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-habbo-cyan/10 border border-habbo-cyan/30 rounded-lg text-sm text-habbo-cyan hover:bg-habbo-cyan/20 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/catalog"
          className="px-5 py-2.5 bg-habbo-gold/10 border border-habbo-gold/30 rounded-lg text-sm text-habbo-gold hover:bg-habbo-gold/20 transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    </div>
  );
}
