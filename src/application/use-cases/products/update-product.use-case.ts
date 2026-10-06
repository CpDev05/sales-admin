import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProductDto } from '../../dto/product.dto';
import { toProductDto } from '../../dto/product.mapper';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { Product } from '../../../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../domain/repositories/product.repository';
import { UpdateProductCommand } from '../../dto/product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly products: ProductRepository,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductDto> {
    const product = await this.products.findById(command.id);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (command.price !== undefined && command.price <= 0) {
      throw new BadRequestException('El precio debe ser mayor que cero');
    }

    if (command.sku !== undefined && command.sku !== product.sku) {
      const existing = await this.products.findBySku(command.sku);
      if (existing && existing.id !== product.id) {
        throw new BadRequestException('Ya existe un producto con ese SKU');
      }
    }

    const updated = new Product(product.id, {
      name: command.name ?? product.name,
      description: command.description ?? product.description,
      price: command.price ?? product.price,
      status: product.status,
      sku: command.sku ?? product.sku,
      category: command.category ?? product.category,
      createdAt: product.createdAt,
      updatedAt: this.dates.now(),
    });

    return toProductDto(await this.products.update(updated));
  }
}
