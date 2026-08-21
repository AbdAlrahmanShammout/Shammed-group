import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role } from '@/authentication/enum/role.enum';
import { BaseMessageResponse } from '@/common/base/base-message-response.dto';
import { Roles } from '@/common/decorators/route/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { CreateProductCategoryRequestDto } from '@/modules/product-category/dto/request/create-product-category-request.dto';
import { DeleteProductCategoryRequestDto } from '@/modules/product-category/dto/request/delete-product-category-request.dto';
import { GetProductCategoriesRequestDto } from '@/modules/product-category/dto/request/get-product-categories-request.dto';
import { UpdateProductCategoryRequestDto } from '@/modules/product-category/dto/request/update-product-category-request.dto';
import { GetProductCategoriesResponseDto } from '@/modules/product-category/dto/response/get-product-categories-response.dto';
import { ProductCategoryResponseDto } from '@/modules/product-category/dto/response/product-category-response.dto';
import { ProductCategoryService } from '@/modules/product-category/product-category.service';

@ApiTags('Admin - Product Category')
@Controller('admin/product-category')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class ProductCategoryAdminController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product category' })
  @ApiBody({ type: CreateProductCategoryRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductCategoryResponseDto })
  async createProductCategory(
    @Body() requestDto: CreateProductCategoryRequestDto,
  ): Promise<ProductCategoryResponseDto> {
    const productCategory = await this.productCategoryService.createProductCategory({
      name: requestDto.name,
      description: requestDto.description,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      color: requestDto.color,
    });
    return new ProductCategoryResponseDto(productCategory);
  }

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  @ApiResponse({ status: HttpStatus.OK, type: GetProductCategoriesResponseDto })
  async getProductCategories(
    @Query() query: GetProductCategoriesRequestDto,
  ): Promise<GetProductCategoriesResponseDto> {
    const page = await this.productCategoryService.findProductCategories({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetProductCategoriesResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ProductCategoryResponseDto })
  async getProductCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductCategoryResponseDto> {
    const productCategory = await this.productCategoryService.getProductCategoryById(id);
    return new ProductCategoryResponseDto(productCategory);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductCategoryRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ProductCategoryResponseDto })
  async updateProductCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDto: UpdateProductCategoryRequestDto,
  ): Promise<ProductCategoryResponseDto> {
    const productCategory = await this.productCategoryService.updateProductCategory({
      id,
      name: requestDto.name,
      description: requestDto.description,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      color: requestDto.color,
    });
    return new ProductCategoryResponseDto(productCategory);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseMessageResponse })
  async deleteProductCategory(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: DeleteProductCategoryRequestDto,
  ): Promise<BaseMessageResponse> {
    await this.productCategoryService.deleteProductCategory({
      id,
      replacementCategoryId: query.replacementCategoryId,
    });
    return new BaseMessageResponse({ message: 'Product category deleted', status: 'ok' });
  }
}
