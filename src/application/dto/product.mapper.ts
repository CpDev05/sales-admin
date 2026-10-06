import { Product } from '../../domain/entities/product.entity';
import { ProductDto } from './product.dto';

export function toProductDto(product: Product): ProductDto {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    status: product.status,
    sku: product.sku,
    category: product.category,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
