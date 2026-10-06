import { Module } from '@nestjs/common';

import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import { ProductsController } from '../../presentation/controllers/products.controller';
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';
import { GetProductUseCase } from '../../application/use-cases/products/get-product.use-case';
import { ListProductsUseCase } from '../../application/use-cases/products/list-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { PrismaModule } from '../database/prisma/prisma.module';
import { PrismaProductRepository } from '../repositories/prisma-product.repository';
import { AuthModule } from '../security/auth.module';
import { PermissionsModule } from '../security/permissions.module';

@Module({
  imports: [PrismaModule, AuthModule, PermissionsModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
