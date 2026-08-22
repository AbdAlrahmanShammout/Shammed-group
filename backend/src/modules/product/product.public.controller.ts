import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetProductsRequestDto } from '@/modules/product/dto/request/get-products-request.dto';
import { GetProductsResponseDto } from '@/modules/product/dto/response/get-products-response.dto';
import { ProductResponseDto } from '@/modules/product/dto/response/product-response.dto';
import { ProductService } from '@/modules/product/product.service';

@ApiTags('Public - Product')
@Controller('product')
export class ProductPublicController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List visible products' })
  @ApiResponse({ status: HttpStatus.OK, type: GetProductsResponseDto })
  async getProducts(@Query() query: GetProductsRequestDto): Promise<GetProductsResponseDto> {
    const page = await this.productService.findPublicProducts({
      limit: query.limit,
      offset: query.offset,
      categoryId: query.categoryId,
      partnerId: query.partnerId,
      search: query.search,
    });
    return new GetProductsResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visible product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ProductResponseDto })
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productService.getPublicProductById(id);
    return new ProductResponseDto(product);
  }
}
