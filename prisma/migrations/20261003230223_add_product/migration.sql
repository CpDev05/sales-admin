-- CreateTable
CREATE TABLE "Product" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(500),
    "price" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(40) NOT NULL,
    "sku" VARCHAR(80),
    "category" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
