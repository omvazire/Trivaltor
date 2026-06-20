import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Only scroll to top or anchor on PUSH or REPLACE navigation
    // POP navigation represents browser back/forward or reload, where we preserve scroll behavior
    if (navType === 'PUSH' || navType === 'REPLACE') {
      if (hash) {
        // Scroll to the targeted anchor smoothly after a short delay to allow page rendering
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, hash, navType]);

  return null;
};
