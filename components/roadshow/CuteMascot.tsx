import React, { useEffect, useRef, useState } from 'react';
import mascotData from './cute-mascot.json';

interface CuteMascotProps {
  className?: string;
}

export default function CuteMascot({ className = '' }: CuteMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    let anim: any = null;
    let isMounted = true;

    import('lottie-web').then((lottieModule) => {
      if (!isMounted || !containerRef.current) return;
      const lottie = (lottieModule as any).default || lottieModule;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: mascotData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid meet',
        },
      });
      anim.setSpeed(1.1);
    });

    return () => {
      isMounted = false;
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

  const handleClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1200);
  };

  return (
    <div
      className={`cute-mascot-wrapper ${isWaving ? 'is-interacting' : ''} ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="cute-mascot-bounce">
        <div className="cute-mascot-canvas" ref={containerRef} />
      </div>
      <div className="cute-mascot-ground-shadow" aria-hidden="true" />
    </div>
  );
}
