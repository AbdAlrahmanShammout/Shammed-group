import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateContactInquiryRepoInput,
  FindContactInquiriesRepoInput,
  UpdateContactInquiryRepoInput,
} from '@/modules/contact-inquiry/defs/contact-inquiry-repository.defs';
import { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';

export abstract class ContactInquiryRepository {
  abstract create(
    input: CreateContactInquiryRepoInput,
    context?: TransactionContext,
  ): Promise<ContactInquiryEntity>;
  abstract findById(id: number): Promise<ContactInquiryEntity | null>;
  abstract findMany(input: FindContactInquiriesRepoInput): Promise<ContactInquiryEntity[]>;
  abstract count(status?: string): Promise<number>;
  abstract update(
    input: UpdateContactInquiryRepoInput,
    context?: TransactionContext,
  ): Promise<ContactInquiryEntity>;
}
