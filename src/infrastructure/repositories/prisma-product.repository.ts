import { Injectable } from '@nestjs/common';

import { Product } from '../../domain/entities/product.entity';
import { ProductStatus } from '../../domain/enums/product-status.enum';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(product: Product): Promise<Product> {
    const stored = await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status,
        sku: product.sku,
        category: product.category,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });

    return this.toDomain(stored);
  }

  async update(product: Product): Promise<Product> {
    const stored = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        status: product.status,
        sku: product.sku,
        category: product.category,
        updatedAt: product.updatedAt,
      },
    });

    return this.toDomain(stored);
  }

  async findById(id: string): Promise<Product | null> {
    const stored = await this.prisma.product.findUnique({ where: { id } });
    return stored ? this.toDomain(stored) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const stored = await this.prisma.product.findUnique({ where: { sku } });
    return stored ? this.toDomain(stored) : null;
  }

  async findAllActive(): Promise<Product[]> {
    const stored = await this.prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      orderBy: { createdAt: 'asc' },
    });

    return stored.map((product) => this.toDomain(product));
  }

  private toDomain(stored: {
    id: string;
    name: string;
    description: string;
    price: number;
    status: string;
    sku: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product(stored.id, {
      name: stored.name,
      description: stored.description,
      price: stored.price,
      status: stored.status as ProductStatus,
      sku: stored.sku,
      category: stored.category,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    });
  }
}
