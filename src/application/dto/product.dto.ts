export interface ProductDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  status: string;
  sku?: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductCommand {
  name: string;
  description?: string;
  price: number;
  sku?: string;
  category?: string;
}

export interface UpdateProductCommand {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  category?: string;
}
