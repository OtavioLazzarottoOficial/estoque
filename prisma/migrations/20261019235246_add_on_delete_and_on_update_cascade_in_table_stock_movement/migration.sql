-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_product_Id_fkey";

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_product_Id_fkey" FOREIGN KEY ("product_Id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
