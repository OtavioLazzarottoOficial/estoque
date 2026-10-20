-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_product_Id_fkey";

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_product_Id_fkey" FOREIGN KEY ("product_Id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
