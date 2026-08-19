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

describe('catalog schema', () => {
  it('requires a Product category and allows an optional partner', () => {
    const category = findField('Product', 'category');
    const partner = findField('Product', 'partner');
    expect(category.type).toBe('ProductCategory');
    expect(category.isRequired).toBe(true);
    expect(category.relationOnDelete).toBe('Restrict');
    expect(partner.type).toBe('Partner');
    expect(partner.isRequired).toBe(false);
    expect(findField('Product', 'partnerId').isRequired).toBe(false);
  });

  it('gives Partner, ProductCategory, Product, and Service visibility and display order', () => {
    const catalogModels = ['Partner', 'ProductCategory', 'Product', 'Service'];
    for (const modelName of catalogModels) {
      expect(findField(modelName, 'isVisible').type).toBe('Boolean');
      expect(findField(modelName, 'displayOrder').type).toBe('Int');
    }
  });
});
