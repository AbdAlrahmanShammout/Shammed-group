import { BaseConfigService } from '@/config/base-config.service';

describe('BaseConfigService', () => {
  it('returns a configured value', () => {
    const configService = {
      get: jest.fn().mockReturnValue(3000),
    };
    const actual = new BaseConfigService(configService as never);
    expect(actual.getValue<number>('app.port')).toBe(3000);
  });

  it('throws when a configuration key is missing', () => {
    const configService = {
      get: jest.fn().mockReturnValue(undefined),
    };
    const actual = new BaseConfigService(configService as never);
    expect(() => actual.getValue<string>('app.url')).toThrow('Missing configuration key: app.url');
  });
});
