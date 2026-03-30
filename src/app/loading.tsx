export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 bg-habbo-card rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-habbo-card/60 rounded animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-40 bg-habbo-card pixel-border rounded-lg animate-pulse" />
          <div className="h-40 bg-habbo-card pixel-border rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-habbo-card pixel-border rounded-lg p-3 animate-pulse"
            >
              <div className="w-full h-20 bg-habbo-border/30 rounded mb-2" />
              <div className="h-3 bg-habbo-border/30 rounded w-3/4 mb-1" />
              <div className="h-2 bg-habbo-border/20 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
