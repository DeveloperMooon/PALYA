
const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  'https://palya.onrender.com'
).replace(/\/$/, '');

export async function featureApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
  );

  const contentType =
    response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'object' &&
      data !== null &&
      'error' in data
        ? String(data.error)
        : `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data as T;
}
