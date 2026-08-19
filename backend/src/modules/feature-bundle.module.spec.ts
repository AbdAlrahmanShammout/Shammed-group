import { Test } from '@nestjs/testing';

import { FeatureBundleModule } from '@/modules/feature-bundle.module';

describe('FeatureBundleModule', () => {
  it('compiles with public and admin audience modules', async () => {
    const actual = await Test.createTestingModule({
      imports: [FeatureBundleModule],
    }).compile();
    expect(actual).toBeDefined();
    await actual.close();
  });
});
