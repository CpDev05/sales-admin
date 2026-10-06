import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ProductDto } from '../../dto/product.dto';
import { toProductDto } from '../../dto/product.mapper';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../domain/repositories/product.repository';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  async execute(id: string): Promise<ProductDto> {
    const product = await this.products.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return toProductDto(product);
  }
}
