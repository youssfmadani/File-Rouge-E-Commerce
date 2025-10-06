export const API_BASE = (typeof window !== 'undefined' && (window as any).ENV_API_BASE_URL)
  ? (window as any).ENV_API_BASE_URL
  : 'http://localhost:8084';

export const apiUrl = (path: string): string => {
  if (!path) {
    return API_BASE;
  }
  return path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
};
