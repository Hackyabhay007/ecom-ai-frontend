const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const createApiUrl = (path) => `${API_BASE_URL}${path}`;
export const createImageUrl = (path) => {
  if (!path) return '/default-avatar.png';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};
