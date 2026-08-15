const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BACKEND_URL}${url}`;
}
