import { createContext, useContext } from 'react';

/**
 * Provides the URL of the custom branded placeholder image shown while
 * content images are loading. Set to undefined when no placeholder is
 * configured; ProgressiveImage falls back to a gradient skeleton in that case.
 */
export const ImagePlaceholderContext = createContext<string | undefined>(undefined);

/**
 * Returns the current custom placeholder image URL, or undefined if none is set.
 */
export function useImagePlaceholder(): string | undefined {
  return useContext(ImagePlaceholderContext);
}
