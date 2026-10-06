import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductRepository {
  create(product: Product): Promise<Product>;

  update(product: Product): Promise<Product>;

  findById(id: string): Promise<Product | null>;

  findBySku(sku: string): Promise<Product | null>;

  findAllActive(): Promise<Product[]>;
}
