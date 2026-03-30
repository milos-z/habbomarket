"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#0e1326",
          color: "#e8ecf4",
          fontFamily: "Inter, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <div
            style={{
              width: 80,
              height: 80,
              margin: "0 auto 1.5rem",
              borderRadius: 16,
              background: "rgba(255, 71, 87, 0.1)",
              border: "1px solid rgba(255, 71, 87, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 18, color: "#ff4757", marginBottom: 8 }}>
            Critical Error
          </h1>
          <p style={{ fontSize: 14, color: "#8899b8", marginBottom: 8, maxWidth: 400 }}>
            Something went seriously wrong. Please try refreshing the page.
          </p>
          {error.digest && (
            <p style={{ fontSize: 11, color: "#8899b855", fontFamily: "monospace", marginBottom: 24 }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              padding: "10px 20px",
              background: "rgba(0, 212, 255, 0.1)",
              border: "1px solid rgba(0, 212, 255, 0.3)",
              borderRadius: 8,
              color: "#00d4ff",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
