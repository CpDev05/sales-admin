import { Inject, Injectable } from '@nestjs/common';

import { ProductDto } from '../../dto/product.dto';
import { toProductDto } from '../../dto/product.mapper';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../domain/repositories/product.repository';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
  ) {}

  async execute(): Promise<ProductDto[]> {
    const products = await this.products.findAllActive();

    return products.map(toProductDto);
  }
}
