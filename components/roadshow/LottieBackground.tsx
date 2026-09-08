import React, { useEffect, useRef } from 'react';
import animationData from './abstract-ai.json';

export default function LottieBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

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
        animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      });
    });

    return () => {
      isMounted = false;
      if (anim) {
        anim.destroy();
      }
    };
  }, []);

  return (
    <div className="lottie-bg-wrapper" aria-hidden="true">
      <div className="lottie-bg-canvas" ref={containerRef} />
      <div className="lottie-bg-overlay" />
    </div>
  );
}
