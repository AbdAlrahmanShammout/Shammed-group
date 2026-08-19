import { Prisma } from '@prisma/client';

function findModel(name: string): Prisma.DMMF.Model {
  const actual = Prisma.dmmf.datamodel.models.find((model) => model.name === name);
  if (!actual) {
    throw new Error(`Missing Prisma model: ${name}`);
  }
  return actual;
}

function findField(modelName: string, fieldName: string): Prisma.DMMF.Field {
  const actual = findModel(modelName).fields.find((field) => field.name === fieldName);
  if (!actual) {
    throw new Error(`Missing Prisma field: ${modelName}.${fieldName}`);
  }
  return actual;
}

describe('home and about page-content schema', () => {
  it('keeps HomePage and AboutPage as singleton rows', () => {
    expect(findField('HomePage', 'singletonKey').isUnique).toBe(true);
    expect(findField('AboutPage', 'singletonKey').isUnique).toBe(true);
  });

  it('does not copy Partner, Product, or Service rows onto HomePage', () => {
    const relationTypes = findModel('HomePage')
      .fields.filter((field) => field.kind === 'object')
      .map((field) => field.type);
    expect(relationTypes).not.toContain('Partner');
    expect(relationTypes).not.toContain('Product');
    expect(relationTypes).not.toContain('Service');
    expect(relationTypes).not.toContain('ProductCategory');
  });

  it('stores About vision, mission, values, and capabilities as free-form text', () => {
    expect(findField('AboutPage', 'overview').type).toBe('String');
    expect(findField('AboutPage', 'vision').type).toBe('String');
    expect(findField('AboutPage', 'mission').type).toBe('String');
    expect(findField('AboutPage', 'values').type).toBe('String');
    expect(findField('AboutPage', 'capabilities').type).toBe('String');
  });
});
