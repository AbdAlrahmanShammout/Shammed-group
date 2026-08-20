import { useEffect, useRef, type RefObject } from 'react';

import { getFocusableElements } from '@/lib/a11y/get-focusable-elements';

type UseMobileNavAccessibilityInput = {
  readonly isOpen: boolean;
  readonly menuRef: RefObject<HTMLElement | null>;
  readonly onClose: () => void;
  readonly triggerRef: RefObject<HTMLElement | null>;
};

/**
 * Moves focus into an open mobile menu, restores it on close, and closes on Escape or md+ resize.
 */
export function useMobileNavAccessibility({
  isOpen,
  menuRef,
  onClose,
  triggerRef,
}: UseMobileNavAccessibilityInput): void {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const menu = menuRef.current;
    if (menu) {
      const focusableElements = getFocusableElements(menu);
      (focusableElements[0] ?? menu).focus();
    }
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
    }
    function onResize(): void {
      if (window.matchMedia('(min-width: 768px)').matches) {
        onCloseRef.current();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      triggerRef.current?.focus();
    };
  }, [isOpen, menuRef, triggerRef]);
}
