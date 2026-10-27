import React, { useState } from 'react';
import { Home } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Property photograph',
  fallbackTitle = 'Architectural Space',
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div 
        className={`bg-slate-900 text-slate-300 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-radial from-slate-800 to-slate-950 opacity-80" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-2 text-teal-400">
            <Home className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold tracking-wide text-slate-200">{fallbackTitle}</span>
          <span className="text-[11px] text-slate-400 mt-0.5">Property Partner Architectural Record</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse flex items-center justify-center">
          <Home className="w-5 h-5 text-slate-400" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
    </div>
  );
};
