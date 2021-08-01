/**
 * Safely execute browser only code.
 */
export function browserOnly<T>(
  fn: (window: Window) => T,
  fallback: () => T
): T {
  if (typeof window !== 'undefined') {
    return fn(window);
  }

  return fallback();
}
