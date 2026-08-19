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
import { CreateProductRequestDto } from '@/modules/product/dto/request/create-product-request.dto';
import { GetProductsRequestDto } from '@/modules/product/dto/request/get-products-request.dto';
import { UpdateProductRequestDto } from '@/modules/product/dto/request/update-product-request.dto';
import { GetProductsResponseDto } from '@/modules/product/dto/response/get-products-response.dto';
import { ProductResponseDto } from '@/modules/product/dto/response/product-response.dto';
import { ProductService } from '@/modules/product/product.service';

@ApiTags('Admin - Product')
@Controller('admin/product')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ type: CreateProductRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: ProductResponseDto })
  async createProduct(@Body() requestDto: CreateProductRequestDto): Promise<ProductResponseDto> {
    const product = await this.productService.createProduct({
      name: requestDto.name,
      shortDescription: requestDto.shortDescription,
      detailedDescription: requestDto.detailedDescription,
      manufacturer: requestDto.manufacturer,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      categoryId: requestDto.categoryId,
      partnerId: requestDto.partnerId,
      imageMediaId: requestDto.imageMediaId,
    });
    return new ProductResponseDto(product);
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: HttpStatus.OK, type: GetProductsResponseDto })
  async getProducts(@Query() query: GetProductsRequestDto): Promise<GetProductsResponseDto> {
    const page = await this.productService.findProducts({
      limit: query.limit,
      offset: query.offset,
      categoryId: query.categoryId,
    });
    return new GetProductsResponseDto(page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: ProductResponseDto })
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductResponseDto> {
    const product = await this.productService.getProductById(id);
    return new ProductResponseDto(product);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ProductResponseDto })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() requestDto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productService.updateProduct({
      id,
      name: requestDto.name,
      shortDescription: requestDto.shortDescription,
      detailedDescription: requestDto.detailedDescription,
      manufacturer: requestDto.manufacturer,
      isVisible: requestDto.isVisible,
      displayOrder: requestDto.displayOrder,
      categoryId: requestDto.categoryId,
      partnerId: requestDto.partnerId,
      imageMediaId: requestDto.imageMediaId,
    });
    return new ProductResponseDto(product);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: BaseMessageResponse })
  async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<BaseMessageResponse> {
    await this.productService.deleteProduct(id);
    return new BaseMessageResponse({ message: 'Product deleted', status: 'ok' });
  }
}
