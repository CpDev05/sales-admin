import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { DATE_PORT, DatePort } from '../../ports/date.port';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.products.findById(id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    product.deactivate();

    await this.products.update(product);
  }
}
