import React, { useState, useEffect } from 'react';

export default function Monitor() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.classList.add('monitor-scroll-lock');
    return () => {
      document.body.classList.remove('monitor-scroll-lock');
    };
  }, []);

  return (
    <div className="iframe-full">
      {isLoading && (
        <div className="iframe-loading">
          <div className="spinner" aria-hidden="true"></div>
          <p className="loading-text">正在加载...</p>
        </div>
      )}
      <iframe
        id="iframe"
        scrolling="yes"
        frameBorder="0"
        allowFullScreen={true}
        src="https://check.linux.do/group/Packy"
        onLoad={() => setIsLoading(false)}
      ></iframe>
      <div className="iframe-scroll-mask"></div>
    </div>
  );
}
