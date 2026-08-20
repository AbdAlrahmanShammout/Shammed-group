export type DocumentSeoInput = {
  readonly canonicalUrl: string;
  readonly description: string;
  readonly title: string;
};

function upsertMetaTag(attribute: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertCanonicalLink(href: string): void {
  let element = document.head.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

/**
 * Applies document title, description, Open Graph, and canonical URL tags.
 */
export function applyDocumentSeo(input: DocumentSeoInput): void {
  document.title = input.title;
  upsertMetaTag('name', 'description', input.description);
  upsertMetaTag('property', 'og:title', input.title);
  upsertMetaTag('property', 'og:description', input.description);
  upsertMetaTag('property', 'og:type', 'website');
  upsertMetaTag('property', 'og:url', input.canonicalUrl);
  upsertCanonicalLink(input.canonicalUrl);
}
