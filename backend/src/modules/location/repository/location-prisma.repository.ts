import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { TransactionContext } from '@/common/base/transaction-context';
import {
  CreateLocationRepoInput,
  GetLocationsRepoInput,
  LocationPage,
  UpdateLocationRepoInput,
} from '@/modules/location/defs/location-repository.defs';
import { LocationEntity } from '@/modules/location/entity/location.entity';
import { LocationMapper } from '@/modules/location/mapper/location.mapper';
import { LocationRepository } from '@/modules/location/repository/location.repository';
import { locationDetailsInclude } from '@/modules/location/types/location-details.include';
import { PrismaProviderService } from '@/providers/database/prisma/prisma-provider.service';
import { resolvePrismaClient } from '@/providers/database/prisma/prisma-transaction-context';

@Injectable()
export class LocationPrismaRepository implements LocationRepository {
  constructor(private readonly prismaProviderService: PrismaProviderService) {}

  async create(
    input: CreateLocationRepoInput,
    context?: TransactionContext,
  ): Promise<LocationEntity> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    const result = await client.location.create({
      data: {
        name: input.name,
        address: input.address,
        googleMapsUrl: input.googleMapsUrl,
        latitude: input.latitude,
        longitude: input.longitude,
        isVisible: input.isVisible,
        displayOrder: input.displayOrder,
        phones: {
          create: input.phones.map((phone) => ({
            phone: phone.phone,
            displayOrder: phone.displayOrder,
          })),
        },
      },
      include: locationDetailsInclude,
    });
    return LocationMapper.toEntity(result);
  }

  async findById(id: number): Promise<LocationEntity | null> {
    const result = await this.prismaProviderService.location.findUnique({
      where: { id },
      include: locationDetailsInclude,
    });
    if (!result) {
      return null;
    }
    return LocationMapper.toEntity(result);
  }

  async findAll(input: GetLocationsRepoInput): Promise<LocationPage> {
    const where: Prisma.LocationWhereInput = {};
    if (input.isVisible !== undefined) {
      where.isVisible = input.isVisible;
    }
    const [results, total] = await this.prismaProviderService.$transaction([
      this.prismaProviderService.location.findMany({
        where,
        include: locationDetailsInclude,
        orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
        take: input.limit,
        skip: input.offset,
      }),
      this.prismaProviderService.location.count({ where }),
    ]);
    return {
      entities: results.map((result) => LocationMapper.toEntity(result)),
      total,
    };
  }

  async update(
    input: UpdateLocationRepoInput,
    context?: TransactionContext,
  ): Promise<LocationEntity> {
    if (context) {
      return this.executeUpdate(resolvePrismaClient(this.prismaProviderService, context), input);
    }
    return this.prismaProviderService.$transaction((tx) => this.executeUpdate(tx, input));
  }

  async delete(id: number, context?: TransactionContext): Promise<void> {
    const client = resolvePrismaClient(this.prismaProviderService, context);
    await client.location.delete({ where: { id } });
  }

  private async executeUpdate(
    client: PrismaProviderService | Prisma.TransactionClient,
    input: UpdateLocationRepoInput,
  ): Promise<LocationEntity> {
    if (input.phones !== undefined) {
      await client.locationPhone.deleteMany({ where: { locationId: input.id } });
    }
    const result = await client.location.update({
      where: { id: input.id },
      data: this.buildUpdateData(input),
      include: locationDetailsInclude,
    });
    return LocationMapper.toEntity(result);
  }

  private buildUpdateData(input: UpdateLocationRepoInput): Prisma.LocationUpdateInput {
    const data: Prisma.LocationUpdateInput = {};
    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.address !== undefined) {
      data.address = input.address;
    }
    if (input.googleMapsUrl !== undefined) {
      data.googleMapsUrl = input.googleMapsUrl;
    }
    if (input.latitude !== undefined) {
      data.latitude = input.latitude;
    }
    if (input.longitude !== undefined) {
      data.longitude = input.longitude;
    }
    if (input.isVisible !== undefined) {
      data.isVisible = input.isVisible;
    }
    if (input.displayOrder !== undefined) {
      data.displayOrder = input.displayOrder;
    }
    if (input.phones !== undefined) {
      data.phones = {
        create: input.phones.map((phone) => ({
          phone: phone.phone,
          displayOrder: phone.displayOrder,
        })),
      };
    }
    return data;
  }
}
