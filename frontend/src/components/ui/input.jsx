export function Input({ className = '', ...props }) {
  return (
    <input
      className={`form-input-agri rounded-lg px-4 py-2.5 w-full ${className}`}
      {...props}
    />
  );
}
