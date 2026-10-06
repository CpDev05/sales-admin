import { Entity } from './entity';
import { ProductStatus } from '../enums/product-status.enum';

export interface ProductProps {
  name: string;
  description?: string;
  price: number;
  status: ProductStatus;
  sku?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends Entity<ProductProps> {
  constructor(id: string, props: ProductProps) {
    super(id, props);
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  get sku(): string {
    return this.props.sku;
  }

  get category(): string {
    return this.props.category;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return this.props.status === ProductStatus.ACTIVE;
  }

  deactivate(): void {
    this.props.status = ProductStatus.INACTIVE;
  }
}
