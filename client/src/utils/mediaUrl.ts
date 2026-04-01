const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getApiOrigin = () => {
  if (API_URL.startsWith('/')) {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'http://localhost:3000';
  }

  try {
    return new URL(API_URL).origin;
  } catch {
    return removeTrailingSlash(API_URL).replace(/\/api$/, '');
  }
};

const API_ORIGIN = removeTrailingSlash(getApiOrigin());

export const resolveMediaUrl = (value?: string | null) => {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^(data:|blob:|https?:\/\/|\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith('/uploads/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  if (trimmed.startsWith('uploads/')) {
    return `${API_ORIGIN}/${trimmed}`;
  }

  return trimmed;
};
