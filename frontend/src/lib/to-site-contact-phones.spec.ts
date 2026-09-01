import { describe, expect, it } from 'vitest';

import { toSiteContactPhones } from '@/lib/to-site-contact-phones';

describe('toSiteContactPhones', () => {
  it('returns labeled phones when present', () => {
    const actual = toSiteContactPhones({
      phone: '0911111111',
      phones: [
        { label: 'Sales', phone: '0911111111' },
        { label: 'Accounting', phone: '0922222222' },
      ],
    });
    expect(actual).toEqual([
      { label: 'Sales', phone: '0911111111' },
      { label: 'Accounting', phone: '0922222222' },
    ]);
  });

  it('falls back to the main phone when the list is empty', () => {
    const actual = toSiteContactPhones({ phone: '0911111111', phones: [] });
    expect(actual).toEqual([{ label: 'Phone', phone: '0911111111' }]);
  });
});
