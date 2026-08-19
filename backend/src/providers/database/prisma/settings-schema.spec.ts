import { Prisma } from '@prisma/client';

function findModel(name: string): Prisma.DMMF.Model {
  const actual = Prisma.dmmf.datamodel.models.find((model) => model.name === name);
  if (!actual) {
    throw new Error(`Missing Prisma model: ${name}`);
  }
  return actual;
}

describe('settings location social schema', () => {
  it('relates optional SiteSettings logo and favicon to Media', () => {
    const siteSettings = findModel('SiteSettings');
    const logo = siteSettings.fields.find((field) => field.name === 'logo');
    const favicon = siteSettings.fields.find((field) => field.name === 'favicon');
    expect(logo?.type).toBe('Media');
    expect(favicon?.type).toBe('Media');
    expect(logo?.isRequired).toBe(false);
    expect(favicon?.isRequired).toBe(false);
  });

  it('allows a Location to have multiple phones', () => {
    const location = findModel('Location');
    const phones = location.fields.find((field) => field.name === 'phones');
    expect(phones?.type).toBe('LocationPhone');
    expect(phones?.isList).toBe(true);
  });

  it('stores SocialLink platform as CMS text rather than a hardcoded enum', () => {
    const socialLink = findModel('SocialLink');
    const platform = socialLink.fields.find((field) => field.name === 'platform');
    expect(platform?.type).toBe('String');
  });
});
