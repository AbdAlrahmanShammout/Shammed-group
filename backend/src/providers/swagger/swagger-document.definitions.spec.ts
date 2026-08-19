import { AdminApiModule } from '@/modules/admin-api.module';
import { PublicApiModule } from '@/modules/public-api.module';
import { SWAGGER_ADMIN_JSON_PATH, SWAGGER_PUBLIC_JSON_PATH } from '@/providers/swagger/consts';
import { SWAGGER_DOCUMENT_DEFINITIONS } from '@/providers/swagger/swagger-document.definitions';

describe('SWAGGER_DOCUMENT_DEFINITIONS', () => {
  it('declares public and admin audiences', () => {
    const actualNames = SWAGGER_DOCUMENT_DEFINITIONS.map((definition) => definition.name);
    const expectedNames = ['public', 'admin'];
    expect(actualNames).toEqual(expectedNames);
  });

  it('scopes each document to its audience module', () => {
    const actualPublic = SWAGGER_DOCUMENT_DEFINITIONS.find(
      (definition) => definition.name === 'public',
    );
    const actualAdmin = SWAGGER_DOCUMENT_DEFINITIONS.find(
      (definition) => definition.name === 'admin',
    );
    expect(actualPublic).toEqual(
      expect.objectContaining({
        jsonPath: SWAGGER_PUBLIC_JSON_PATH,
        include: [PublicApiModule],
        hasBearerAuth: false,
      }),
    );
    expect(actualAdmin).toEqual(
      expect.objectContaining({
        jsonPath: SWAGGER_ADMIN_JSON_PATH,
        include: [AdminApiModule],
        hasBearerAuth: true,
      }),
    );
  });
});
