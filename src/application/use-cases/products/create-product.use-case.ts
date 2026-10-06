import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ProductDto } from '../../dto/product.dto';
import { toProductDto } from '../../dto/product.mapper';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { UUID_PORT, UuidPort } from '../../ports/uuid.port';
import { Product } from '../../../domain/entities/product.entity';
import { ProductStatus } from '../../../domain/enums/product-status.enum';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../domain/repositories/product.repository';
import { CreateProductCommand } from '../../dto/product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(UUID_PORT)
    private readonly uuid: UuidPort,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductDto> {
    if (command.price <= 0) {
      throw new BadRequestException('El precio debe ser mayor que cero');
    }

    if (command.sku) {
      const existing = await this.products.findBySku(command.sku);
      if (existing) {
        throw new BadRequestException('Ya existe un producto con ese SKU');
      }
    }

    const now = this.dates.now();
    const product = new Product(this.uuid.generate(), {
      name: command.name,
      description: command.description,
      price: command.price,
      status: ProductStatus.ACTIVE,
      sku: command.sku,
      category: command.category,
      createdAt: now,
      updatedAt: now,
    });

    return toProductDto(await this.products.create(product));
  }
}
