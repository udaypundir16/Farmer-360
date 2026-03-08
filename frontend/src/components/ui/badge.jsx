export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200',
    success: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200',
    danger: 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200',
    warning: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200',
    info: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200',
  };

  return (
    <>
      <style>{`
        .badge-enhanced {
          transition: all 0.3s ease;
          display: inline-block;
        }
        
        .badge-enhanced:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <span className={`badge-enhanced px-3 py-1 rounded-full text-xs font-bold ${variants[variant] || variants.default} ${className}`}>
        {children}
      </span>
    </>
  );
}
