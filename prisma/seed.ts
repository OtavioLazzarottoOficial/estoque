import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  const categoryNames = [
    'Eletrônicos',
    'Roupas',
    'Alimentos',
    'Bebidas',
    'Limpeza',
    'Ferramentas',
    'Escritório',
    'Brinquedos',
    'Cosméticos',
    'Esportes',
  ];

  const categories: any[] = [];
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { id: name },
      update: {},
      create: {
        id: name,
        name,
        descriptions: `Categoria de ${name.toLowerCase()}`,
      },
    });
    categories.push(category);
  }

  console.log(`✅ Created ${categories.length} categories`);

  const products: any[] = [];
  for (let i = 1; i <= 50; i++) {
    const category = categories[i % categories.length];
    const product = await prisma.product.create({
      data: {
        sku: `SKU-${String(i).padStart(5, '0')}`,
        name: `Produto ${i}`,
        description: `Descrição do produto ${i}`,
        price: Math.round((Math.random() * 500 + 10) * 100) / 100,
        status: 'ACTIVE',
        category_Id: category.id,
      },
    });
    products.push(product);
  }

  console.log(`✅ Created ${products.length} products`);

  for (const product of products) {
    await prisma.stock.create({
      data: {
        product_Id: product.id,
        quantityInStock: Math.floor(Math.random() * 100),
        quantityMax: 200,
        quantityMin: 10,
      },
    });
  }

  console.log(`✅ Created stocks for ${products.length} products`);
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
