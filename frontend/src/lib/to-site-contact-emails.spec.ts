import { describe, expect, it } from 'vitest';

import { toSiteContactEmails } from '@/lib/to-site-contact-emails';

describe('toSiteContactEmails', () => {
  it('returns labeled emails when present', () => {
    const actual = toSiteContactEmails({
      email: 'info@example.com',
      emails: [
        { label: 'Sales', email: 'sales@example.com' },
        { label: 'Accounting', email: 'accounts@example.com' },
      ],
    });
    expect(actual).toEqual([
      { label: 'Sales', email: 'sales@example.com' },
      { label: 'Accounting', email: 'accounts@example.com' },
    ]);
  });

  it('falls back to the main email when the list is empty', () => {
    const actual = toSiteContactEmails({ email: 'info@example.com', emails: [] });
    expect(actual).toEqual([{ label: 'Email', email: 'info@example.com' }]);
  });
});
