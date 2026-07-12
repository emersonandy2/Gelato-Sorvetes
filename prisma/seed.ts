import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// Free stock images for products (using picsum.photos)
const productImages: Record<string, string[]> = {
  "sorvete-de-morango": [
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=800",
  ],
  "sorvete-de-chocolate": [
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
  ],
  "sorvete-de-baunilha": [
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800",
  ],
  "gelato-pistache": [
    "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=800",
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800",
  ],
  "gelato-tiramisu": [
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=800",
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800",
  ],
  "acai-tradicional": [
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
  ],
  "acai-banana-morango": [
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800",
  ],
  "milkshake-nutella": [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800",
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800",
  ],
  "milkshake-ovomaltine": [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800",
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800",
  ],
  "sorvete-de-manga": [
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800",
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800",
  ],
};

async function main() {
  console.log("Seeding database...");

  // Seed default admin with hashed password
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@gelato.com" },
    update: {},
    create: {
      email: "admin@gelato.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("Admin user seeded (email: admin@gelato.com, password: admin123)");

  // Seed default store settings
  const settings = [
    { key: "store_name", value: "Gelato & Sorvetes" },
    { key: "phone", value: "" },
    { key: "whatsapp", value: "" },
    { key: "instagram", value: "" },
    { key: "facebook", value: "" },
    {
      key: "opening_hours",
      value: '{"mon-fri":"09:00-22:00","sat-sun":"10:00-23:00"}',
    },
    { key: "minimum_order", value: "20" },
    { key: "delivery_fee", value: "5" },
    { key: "google_maps_link", value: "" },
    {
      key: "whatsapp_message_template",
      value:
        "*Novo Pedido*\n\n*Cliente:* {name}\n*Telefone:* {phone}\n*Endereço:* {address}\n*Forma de Pagamento:* {payment}\n\n*Itens:*\n{items}\n\n*Observações:* {notes}\n*Total:* {total}",
    },
  ];

  for (const setting of settings) {
    await prisma.storeSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("Store settings seeded");

  // Seed sample categories
  const categories = [
    { name: "Sorvete", slug: "sorvete", sortOrder: 1 },
    { name: "Gelato", slug: "gelato", sortOrder: 2 },
    { name: "Açaí", slug: "acai", sortOrder: 3 },
    { name: "Milkshake", slug: "milkshake", sortOrder: 4 },
    { name: "Combo", slug: "combo", sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories seeded");

  // Seed sample banner
  await prisma.banner.create({
    data: {
      title: "Bem-vindo ao Gelato & Sorvetes",
      subtitle: "Os melhores sorvetes artesanais da cidade",
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1200",
      active: true,
      sortOrder: 1,
    },
  });
  console.log("Banner seeded");

  // Seed sample delivery area
  const deliveryArea = await prisma.deliveryArea.create({
    data: {
      name: "Centro",
      active: true,
    },
  });

  await prisma.neighborhoodFee.createMany({
    data: [
      { name: "Centro", fee: 5, deliveryAreaId: deliveryArea.id },
      { name: "Jardins", fee: 8, deliveryAreaId: deliveryArea.id },
      { name: "Vila Nova", fee: 10, deliveryAreaId: deliveryArea.id },
    ],
  });
  console.log("Delivery areas seeded");

  // Seed sample products with images
  const sorveteCat = await prisma.category.findUnique({ where: { slug: "sorvete" } });
  const gelatoCat = await prisma.category.findUnique({ where: { slug: "gelato" } });
  const acaiCat = await prisma.category.findUnique({ where: { slug: "acai" } });
  const milkshakeCat = await prisma.category.findUnique({ where: { slug: "milkshake" } });

  const products = [
    {
      name: "Sorvete de Morango",
      slug: "sorvete-de-morango",
      description: "Delicioso sorvete artesanal de morango feito com frutas frescas",
      price: 12.99,
      stock: 50,
      featured: true,
      promotion: false,
      categoryId: sorveteCat?.id || "",
      size: "500ml",
      ingredients: "Leite, creme, açúcar, morango natural",
    },
    {
      name: "Sorvete de Chocolate",
      slug: "sorvete-de-chocolate",
      description: "Sorvete cremoso de chocolate belga premium",
      price: 14.99,
      stock: 40,
      featured: true,
      promotion: true,
      categoryId: sorveteCat?.id || "",
      size: "500ml",
      ingredients: "Leite, creme, cacau belga, açúcar",
    },
    {
      name: "Sorvete de Baunilha",
      slug: "sorvete-de-baunilha",
      description: "Clássico sorvete de baunilha com sementes de baunilha natural",
      price: 11.99,
      stock: 60,
      featured: false,
      promotion: false,
      categoryId: sorveteCat?.id || "",
      size: "500ml",
      ingredients: "Leite, creme, açúcar, baunilha natural",
    },
    {
      name: "Gelato Pistache",
      slug: "gelato-pistache",
      description: "Gelato italiano autêntico com pistache siciliano",
      price: 18.99,
      stock: 30,
      featured: true,
      promotion: false,
      categoryId: gelatoCat?.id || "",
      size: "400ml",
      ingredients: "Leite, creme, açúcar, pistache siciliano",
    },
    {
      name: "Gelato Tiramisù",
      slug: "gelato-tiramisu",
      description: "Gelato inspirado no clássico italiano com café e mascarpone",
      price: 19.99,
      stock: 25,
      featured: false,
      promotion: true,
      categoryId: gelatoCat?.id || "",
      size: "400ml",
      ingredients: "Leite, creme, café espresso, mascarpone, cacau",
    },
    {
      name: "Açaí Tradicional",
      slug: "acai-tradicional",
      description: "Açaí puro batido com banana e guaraná",
      price: 16.99,
      stock: 45,
      featured: true,
      promotion: false,
      categoryId: acaiCat?.id || "",
      size: "500ml",
      ingredients: "Açaí, banana, guaraná em pó",
    },
    {
      name: "Açaí com Banana e Morango",
      slug: "acai-banana-morango",
      description: "Açaí cremoso com banana, morango e granola",
      price: 19.99,
      stock: 35,
      featured: false,
      promotion: false,
      categoryId: acaiCat?.id || "",
      size: "500ml",
      ingredients: "Açaí, banana, morango, granola, leite condensado",
    },
    {
      name: "Milkshake de Nutella",
      slug: "milkshake-nutella",
      description: "Milkshake cremoso com Nutella e sorvete de baunilha",
      price: 22.99,
      stock: 20,
      featured: true,
      promotion: true,
      categoryId: milkshakeCat?.id || "",
      size: "600ml",
      ingredients: "Sorvete de baunilha, Nutella, leite, chantilly",
    },
    {
      name: "Milkshake de Ovomaltine",
      slug: "milkshake-ovomaltine",
      description: "Milkshake cremoso com Ovomaltine crocante",
      price: 21.99,
      stock: 25,
      featured: false,
      promotion: false,
      categoryId: milkshakeCat?.id || "",
      size: "600ml",
      ingredients: "Sorvete de chocolate, Ovomaltine, leite, chantilly",
    },
    {
      name: "Sorvete de Manga",
      slug: "sorvete-de-manga",
      description: "Sorvete tropical de manga com toque de limão",
      price: 13.99,
      stock: 35,
      featured: false,
      promotion: false,
      categoryId: sorveteCat?.id || "",
      size: "500ml",
      ingredients: "Leite, creme, manga natural, limão",
    },
  ];

  for (const product of products) {
    if (product.categoryId) {
      const created = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      });

      // Add images for this product
      const images = productImages[product.slug] || [];
      for (let i = 0; i < images.length; i++) {
        await prisma.productImage.upsert({
          where: {
            id: `img-${created.id}-${i}`,
          },
          update: {},
          create: {
            id: `img-${created.id}-${i}`,
            url: images[i],
            alt: `${product.name} - Imagem ${i + 1}`,
            sortOrder: i,
            productId: created.id,
          },
        });
      }
    }
  }
  console.log("Products with images seeded");

  // Seed sample coupons
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.coupon.upsert({
    where: { code: "BEMVINDO10" },
    update: {},
    create: {
      code: "BEMVINDO10",
      discount: 10,
      type: "percentage",
      minOrder: 30,
      maxUses: 100,
      startDate: now,
      endDate: nextMonth,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "DESCONTO5" },
    update: {},
    create: {
      code: "DESCONTO5",
      discount: 5,
      type: "fixed",
      minOrder: 20,
      startDate: now,
      endDate: nextMonth,
      active: true,
    },
  });
  console.log("Coupons seeded");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
