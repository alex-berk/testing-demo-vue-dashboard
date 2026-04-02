import { describe, expect, it } from 'vitest';
import { buildItemsUrl, getItemCountLabel } from '../lib/catalog.js';

describe('catalog helpers', () => {
  it('builds the default items URL', () => {
    expect(buildItemsUrl('http://127.0.0.1:4000')).toBe(
      'http://127.0.0.1:4000/api/items?section=featured&limit=3&locale=en-US',
    );
  });

  it('should merge custom query params into the request URL', () => {
    expect(
      buildItemsUrl('http://127.0.0.1:4000', {
        section: 'all',
        limit: 2,
        search: 'lamp',
      }),
    ).toBe(
      'http://127.0.0.1:4000/api/items?section=all&limit=2&locale=en-US&search=lamp',
    );
  });

  it('formats the item count label for singular and plural values', () => {
    expect(getItemCountLabel(1)).toBe('1 item loaded');
    expect(getItemCountLabel(3)).toBe('3 items loaded');
  });
});
