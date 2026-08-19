import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetProductCategoriesRequestDto } from '@/modules/product-category/dto/request/get-product-categories-request.dto';
import { GetProductCategoriesResponseDto } from '@/modules/product-category/dto/response/get-product-categories-response.dto';
import { ProductCategoryResponseDto } from '@/modules/product-category/dto/response/product-category-response.dto';
import { ProductCategoryService } from '@/modules/product-category/product-category.service';

@ApiTags('Public - Product Category')
@Controller('product-category')
export class ProductCategoryPublicController {
  constructor(private readonly productCategoryService: ProductCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'List visible product categories' })
  @ApiResponse({ status: HttpStatus.OK, type: GetProductCategoriesResponseDto })
  async getProductCategories(
    @Query() query: GetProductCategoriesRequestDto,
  ): Promise<GetProductCategoriesResponseDto> {
    const page = await this.productCategoryService.findPublicProductCategories({
      limit: query.limit,
      offset: query.offset,
    });
    return new GetProductCategoriesResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visible product category' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ProductCategoryResponseDto })
  async getProductCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductCategoryResponseDto> {
    const productCategory = await this.productCategoryService.getPublicProductCategoryById(id);
    return new ProductCategoryResponseDto(productCategory);
  }
}
