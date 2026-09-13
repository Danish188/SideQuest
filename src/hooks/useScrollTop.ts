import { useEffect } from 'react';

/**
 * Returns the viewport to the top whenever `key` changes.
 *
 * Without this, moving from a tall layout to a short one (a long quest in
 * progress, then the completion screen) leaves the browser's old scroll offset
 * in place and the user sees an empty screen. Jumps rather than smooth-scrolls,
 * so it doesn't fight the page transition.
 */
export function useScrollTop(key: unknown) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [key]);
}
