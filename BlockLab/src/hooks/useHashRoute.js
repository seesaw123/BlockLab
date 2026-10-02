import { useEffect, useState } from 'react';

/* Hash-based routing (#home, #map, #about, #l-1-2). It needs no server setup,
   so the site works on GitHub Pages and any static host. */

export function parseRoute(hash) {
  const h = (hash || '').replace(/^#/, '');
  const lesson = h.match(/^l-(\d+-\d+)$/);
  if (lesson) return { page: 'lesson', id: lesson[1] };
  if (h === 'map' || h === 'about') return { page: h };
  return { page: 'home' };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
