"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-habbo-red/10 border border-habbo-red/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-habbo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <h1 className="font-[family-name:var(--font-pixel)] text-lg text-habbo-red pixel-text-shadow mb-3">
        Something went wrong
      </h1>
      <p className="text-sm text-habbo-text-dim max-w-md mx-auto mb-2 leading-relaxed">
        An unexpected error occurred. Please try again.
      </p>
      {error.digest && (
        <p className="text-xs text-habbo-text-dim/50 font-mono mb-6">
          Error ID: {error.digest}
        </p>
      )}

      <button
        onClick={reset}
        className="px-5 py-2.5 bg-habbo-cyan/10 border border-habbo-cyan/30 rounded-lg text-sm text-habbo-cyan hover:bg-habbo-cyan/20 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
