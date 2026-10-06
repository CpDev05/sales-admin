import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { ProductDto } from '../../application/dto/product.dto';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';
import { GetProductUseCase } from '../../application/use-cases/products/get-product.use-case';
import { ListProductsUseCase } from '../../application/use-cases/products/list-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

class CreateProductBodyDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  price: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

class UpdateProductBodyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  category?: string;
}

@Controller('products')
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  listProducts(): Promise<ProductDto[]> {
    return this.listProductsUseCase.execute();
  }

  @Get(':id')
  getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<ProductDto> {
    return this.getProductUseCase.execute(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('products.manage')
  createProduct(@Body() body: CreateProductBodyDto): Promise<ProductDto> {
    return this.createProductUseCase.execute({
      name: body.name,
      description: body.description,
      price: body.price,
      sku: body.sku,
      category: body.category,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('products.manage')
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateProductBodyDto,
  ): Promise<ProductDto> {
    return this.updateProductUseCase.execute({
      id,
      name: body.name,
      description: body.description,
      price: body.price,
      sku: body.sku,
      category: body.category,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('products.manage')
  async deleteProduct(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
