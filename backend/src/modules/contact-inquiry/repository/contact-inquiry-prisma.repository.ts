import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateContactInquiryRepoInput,
  FindContactInquiriesRepoInput,
  UpdateContactInquiryRepoInput,
} from '@/modules/contact-inquiry/defs/contact-inquiry-repository.defs';
import { ContactInquiryEntity } from '@/modules/contact-inquiry/entity/contact-inquiry.entity';
import { ContactInquiryMapper } from '@/modules/contact-inquiry/mapper/contact-inquiry.mapper';
import { ContactInquiryRepository } from '@/modules/contact-inquiry/repository/contact-inquiry.repository';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class ContactInquiryPrismaRepository implements ContactInquiryRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateContactInquiryRepoInput,
    context?: TransactionContext,
  ): Promise<ContactInquiryEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.contactInquiry.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        subject: input.subject,
        message: input.message,
        emailDeliveryStatus: input.emailDeliveryStatus,
      },
    });
    return ContactInquiryMapper.toEntity(result);
  }

  async findById(id: number): Promise<ContactInquiryEntity | null> {
    const result = await this.prismaProviderService.contactInquiry.findUnique({
      where: { id },
    });
    if (!result) {
      return null;
    }
    return ContactInquiryMapper.toEntity(result);
  }

  async findMany(input: FindContactInquiriesRepoInput): Promise<ContactInquiryEntity[]> {
    const where = input.status ? { emailDeliveryStatus: input.status } : {};
    const results = await this.prismaProviderService.contactInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: input.limit,
      skip: input.offset,
    });
    return results.map((r) => ContactInquiryMapper.toEntity(r));
  }

  async count(status?: string): Promise<number> {
    const where = status
      ? { emailDeliveryStatus: status as Prisma.EnumEmailDeliveryStatusFilter }
      : {};
    return this.prismaProviderService.contactInquiry.count({ where });
  }

  async update(
    input: UpdateContactInquiryRepoInput,
    context?: TransactionContext,
  ): Promise<ContactInquiryEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.contactInquiry.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
    });
    return ContactInquiryMapper.toEntity(result);
  }

  private buildUpdateData(input: UpdateContactInquiryRepoInput): Prisma.ContactInquiryUpdateInput {
    const data: Prisma.ContactInquiryUpdateInput = {};
    if (input.emailDeliveryStatus !== undefined) {
      data.emailDeliveryStatus = input.emailDeliveryStatus;
    }
    if (input.emailDeliveredAt !== undefined) {
      data.emailDeliveredAt = input.emailDeliveredAt;
    }
    return data;
  }
}
