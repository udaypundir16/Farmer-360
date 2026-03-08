export function Card({ children, className = '' }) {
  return (
    <div
      className={`card-agri rounded-agri-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-primary-100/60 bg-white/50 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h2
      className={`font-heading text-lg font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </h2>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div
      className={`border-t border-primary-100/60 px-6 py-4 flex justify-end gap-2 bg-cream-50/50 ${className}`}
    >
      {children}
    </div>
  );
}
