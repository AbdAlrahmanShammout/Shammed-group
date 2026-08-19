import { Test } from '@nestjs/testing';

import { ConfigsModule } from '@/config/configs.module';
import { FeatureBundleModule } from '@/modules/feature-bundle.module';

describe('FeatureBundleModule', () => {
  it('compiles with public and admin audience modules', async () => {
    const actual = await Test.createTestingModule({
      imports: [ConfigsModule, FeatureBundleModule],
    }).compile();
    expect(actual).toBeDefined();
    await actual.close();
  });
});
