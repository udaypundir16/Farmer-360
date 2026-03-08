import React from 'react';

export function Button({ children, className = '', variant = 'default', size = 'default', asChild, ...props }) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 rounded-lg relative overflow-hidden';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variants = {
    default:
      'bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-agri hover:shadow-agri-lg hover:scale-[1.02] active:scale-[0.98] focus:ring-primary-400',
    outline:
      'border-2 border-earth-500 text-earth-600 hover:bg-earth-50 hover:border-earth-600 focus:ring-earth-400',
    secondary:
      'border-2 border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-primary-300',
    danger:
      'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-red-400',
    ghost:
      'bg-transparent text-soil hover:bg-cream-200 focus:ring-primary-200',
  };

  const buttonVariant = variants[variant] ?? variants.default;
  const buttonSize = sizeStyles[size] ?? sizeStyles.default;

  const Comp = asChild ? 'span' : 'button';

  return (
    <Comp
      className={`${baseStyles} ${buttonSize} ${buttonVariant} ${className}`}
      {...(asChild ? {} : props)}
    >
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Comp>
  );
}
