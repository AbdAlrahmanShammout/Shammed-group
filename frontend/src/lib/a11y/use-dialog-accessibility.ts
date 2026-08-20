import { useEffect, useRef, type RefObject } from 'react';

import { getFocusableElements } from '@/lib/a11y/get-focusable-elements';

type UseDialogAccessibilityInput = {
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly isOpen: boolean;
  readonly onEscape: () => void;
};

/**
 * Focuses the dialog on open, traps Tab, handles Escape, and restores prior focus on close.
 */
export function useDialogAccessibility({
  containerRef,
  isOpen,
  onEscape,
}: UseDialogAccessibilityInput): void {
  const onEscapeRef = useRef(onEscape);
  onEscapeRef.current = onEscape;
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = containerRef.current;
    if (container) {
      const focusableElements = getFocusableElements(container);
      const initialFocus = focusableElements[0] ?? container;
      initialFocus.focus();
    }
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault();
        onEscapeRef.current();
        return;
      }
      if (event.key !== 'Tab' || !containerRef.current) {
        return;
      }
      const focusableElements = getFocusableElements(containerRef.current);
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }
      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus();
    };
  }, [containerRef, isOpen]);
}
