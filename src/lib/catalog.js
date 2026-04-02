export const defaultCatalogQuery = Object.freeze({
  section: 'featured',
  limit: 3,
  locale: 'en-US',
});

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000';
}

export function buildItemsUrl(apiBaseUrl, query = {}) {
  const url = new URL('/api/items', apiBaseUrl);
  const finalQuery = { ...defaultCatalogQuery, ...query };

  Object.entries(finalQuery).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function getItemCountLabel(count) {
  return count === 1 ? '1 item loaded' : `${count} items loaded`;
}

export async function fetchFeaturedItems(
  apiBaseUrl = getApiBaseUrl(),
  query = defaultCatalogQuery,
) {
  const response = await fetch(buildItemsUrl(apiBaseUrl, query), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Demo API request failed with status ${response.status}`);
  }

  return response.json();
}
