export function isInternalAppPath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}
