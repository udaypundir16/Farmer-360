import { Wheat } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"
          aria-hidden
        />
        <Wheat
          size={28}
          className="text-primary-600 animate-wheat-spin relative z-10"
          strokeWidth={2.5}
        />
      </div>
      <div className="mt-6 flex items-center gap-1">
        <span className="text-soil font-semibold">Loading</span>
        <span className="animate-typing-dot text-primary-600">.</span>
        <span className="animate-typing-dot animation-delay-200 text-primary-600">.</span>
        <span className="animate-typing-dot animation-delay-400 text-primary-600">.</span>
      </div>
      <p className="mt-3 text-sm text-soil-light">Please wait...</p>
    </div>
  );
}
