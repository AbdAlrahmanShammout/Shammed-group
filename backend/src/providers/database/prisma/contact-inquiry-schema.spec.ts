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

describe('contact inquiry schema', () => {
  it('stores ContactInquiry with an optional phone', () => {
    expect(findField('ContactInquiry', 'fullName').isRequired).toBe(true);
    expect(findField('ContactInquiry', 'email').isRequired).toBe(true);
    expect(findField('ContactInquiry', 'phone').isRequired).toBe(false);
    expect(findField('ContactInquiry', 'subject').isRequired).toBe(true);
    expect(findField('ContactInquiry', 'message').isRequired).toBe(true);
  });

  it('tracks email delivery independently of the inquiry row', () => {
    expect(findField('ContactInquiry', 'emailDeliveryStatus').type).toBe('EmailDeliveryStatus');
    expect(findField('ContactInquiry', 'emailDeliveredAt').isRequired).toBe(false);
  });
});
