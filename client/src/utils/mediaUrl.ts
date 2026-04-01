const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const removeTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const hasProtocol = (value: string) => /^(https?:)?\/\//i.test(value);

const looksLikeDomainPath = (value: string) =>
  /^[a-z0-9.-]+\.[a-z]{2,}(?::\d+)?\//i.test(value) || /^localhost(?::\d+)?\//i.test(value) || /^127\.0\.0\.1(?::\d+)?\//.test(value);

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

  if (!hasProtocol(trimmed) && looksLikeDomainPath(trimmed)) {
    if (trimmed.startsWith('localhost/') || trimmed.startsWith('127.0.0.1/')) {
      return `http://${trimmed}`;
    }
    return `https://${trimmed}`;
  }

  if (trimmed.startsWith('/uploads/')) {
    return `${API_ORIGIN}${trimmed}`;
  }

  if (trimmed.startsWith('uploads/')) {
    return `${API_ORIGIN}/${trimmed}`;
  }

  return trimmed;
};
