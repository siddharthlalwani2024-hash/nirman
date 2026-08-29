export function displayCaption(caption) {
  if (!caption) return null;
  if (/\(\d+\)\s*$/.test(caption)) return null;
  return caption;
}
