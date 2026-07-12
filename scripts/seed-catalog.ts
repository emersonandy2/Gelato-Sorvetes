import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Contextual ice cream images from Unsplash (uploaded to Cloudinary)
const imageUrls: Record<string, string[]> = {
  sorvete: [
    "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600", // chocolate ice cream
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600", // strawberry ice cream
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", // ice cream scoop
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600", // ice cream cone
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600", // ice cream variety
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", // ice cream sundae
    "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600", // pistachio ice cream
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600", // ice cream cup
    "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600", // ice cream bar
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600", // ice cream scoops
  ],
  gelato: [
    "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600", // gelato display
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600", // gelato variety
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", // gelato cup
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600", // gelato cone
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600", // gelato flavors
  ],
  acai: [
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600", // acai bowl
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600", // acai with toppings
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600", // acai smoothie
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600", // acai bowl
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600", // acai
  ],
  milkshake: [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600", // chocolate milkshake
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600", // milkshake variety
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", // strawberry milkshake
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600", // milkshake
    "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600", // milkshake with cream
  ],
  sundae: [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600", // sundae
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", // banana split
    "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600", // sundae toppings
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600", // sundae cup
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", // sundae
  ],
  picole: [
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600", // popsicle
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600", // popsicle flavors
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", // popsicle
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600", // popsicle
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", // popsicle
  ],
  bolo: [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600", // chocolate cake
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600", // cheesecake
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600", // cake slice
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600", // brownie
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600", // petit gateau
  ],
  bebida: [
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600", // orange juice
    "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600", // lemonade
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600", // coffee
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600", // juice
    "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600", // drink
  ],
  combo: [
    "https://images.unsplash.com/photo-1570197571499-166b36435e9f?w=600", // ice cream combo
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600", // ice cream variety
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", // ice cream set
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600", // ice cream combo
    "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=600", // ice cream
  ],
  kids: [
    "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600", // kids ice cream
    "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600", // kids cone
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600", // kids scoop
    "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600", // kids ice cream
    "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600", // kids treat
  ],
};

const categories = [
  { name: "Sorvetes", slug: "sorvete", sortOrder: 1 },
  { name: "Gelatos", slug: "gelato", sortOrder: 2 },
  { name: "Açaís", slug: "acai", sortOrder: 3 },
  { name: "Milkshakes", slug: "milkshake", sortOrder: 4 },
  { name: "Sundae", slug: "sundae", sortOrder: 5 },
  { name: "Picolés", slug: "picole", sortOrder: 6 },
  { name: "Bolos", slug: "bolo", sortOrder: 7 },
  { name: "Bebidas", slug: "bebida", sortOrder: 8 },
  { name: "Combos", slug: "combo", sortOrder: 9 },
  { name: "Kids", slug: "kids", sortOrder: 10 },
];

const products = [
  // SORVETES (10)
  { name: "Chocolate Supremo", slug: "chocolate-supremo", description: "Sorvete cremoso de chocolate belga premium", price: 9.90, stock: 50, featured: true, category: "sorvete", size: "500ml", ingredients: "Leite, creme, cacau belga, açúcar", preparationTime: 5 },
  { name: "Morango Cremoso", slug: "morango-cremoso", description: "Sorvete artesanal de morango com frutas frescas", price: 9.90, stock: 45, featured: true, category: "sorvete", size: "500ml", ingredients: "Leite, creme, morango natural, açúcar", preparationTime: 5 },
  { name: "Flocos Tradicional", slug: "flocos-tradicional", description: "Sorvete clássico com gotas de chocolate", price: 8.90, stock: 60, featured: false, category: "sorvete", size: "500ml", ingredients: "Leite, creme, gotas de chocolate, açúcar", preparationTime: 5 },
  { name: "Pistache Premium", slug: "pistache-premium", description: "Sorvete italiano autêntico com pistache siciliano", price: 12.90, stock: 30, featured: true, category: "sorvete", size: "500ml", ingredients: "Leite, creme, pistache siciliano, açúcar", preparationTime: 5 },
  { name: "Doce de Leite", slug: "doce-de-leite", description: "Sorvete cremoso com doce de leite caseiro", price: 10.90, stock: 40, featured: false, category: "sorvete", size: "500ml", ingredients: "Leite, creme, doce de leite, açúcar", preparationTime: 5 },
  { name: "Cookies & Cream", slug: "cookies-cream", description: "Sorvete de baunilha com cookies triturados", price: 10.90, stock: 35, featured: false, category: "sorvete", size: "500ml", ingredients: "Leite, creme, cookies Oreo, baunilha", preparationTime: 5 },
  { name: "Leite Ninho", slug: "leite-ninho", description: "Sorvete cremoso com leite ninho", price: 9.90, stock: 45, featured: true, category: "sorvete", size: "500ml", ingredients: "Leite, creme, leite ninho, açúcar", preparationTime: 5 },
  { name: "Baunilha Clássica", slug: "baunilha-classica", description: "Sorvete de baunilha com sementes naturais", price: 8.90, stock: 55, featured: false, category: "sorvete", size: "500ml", ingredients: "Leite, creme, baunilha natural, açúcar", preparationTime: 5 },
  { name: "Morango com Nutella", slug: "morango-nutella", description: "Sorvete de morango com ribbons de Nutella", price: 12.90, stock: 25, featured: true, category: "sorvete", size: "500ml", ingredients: "Leite, creme, morango, Nutella", preparationTime: 5 },
  { name: "Chocolate Branco", slug: "chocolate-branco", description: "Sorvete suave de chocolate branco", price: 9.90, stock: 40, featured: false, category: "sorvete", size: "500ml", ingredients: "Leite, creme, chocolate branco, açúcar", preparationTime: 5 },

  // GELATOS (5)
  { name: "Gelato Pistache", slug: "gelato-pistache", description: "Gelato italiano autêntico com pistache", price: 14.90, stock: 30, featured: true, category: "gelato", size: "400ml", ingredients: "Leite, creme, pistache siciliano", preparationTime: 5 },
  { name: "Gelato Tiramisù", slug: "gelato-tiramisu", description: "Gelato inspirado no clássico italiano", price: 15.90, stock: 25, featured: false, category: "gelato", size: "400ml", ingredients: "Leite, creme, café espresso, mascarpone", preparationTime: 5 },
  { name: "Gelato Coco", slug: "gelato-coco", description: "Gelato cremoso com coco tropical", price: 13.90, stock: 35, featured: false, category: "gelato", size: "400ml", ingredients: "Leite, creme, coco ralado, açúcar", preparationTime: 5 },
  { name: "Gelato Ferrero", slug: "gelato-ferrero", description: "Gelato com chocolate e avelã", price: 16.90, stock: 20, featured: true, category: "gelato", size: "400ml", ingredients: "Leite, creme, chocolate, avelã", preparationTime: 5 },
  { name: "Gelato Malte", slug: "gelato-malte", description: "Gelato cremoso com malte crocante", price: 14.90, stock: 25, featured: false, category: "gelato", size: "400ml", ingredients: "Leite, creme, malte, açúcar", preparationTime: 5 },

  // AÇAÍS (5)
  { name: "Açaí Tradicional", slug: "acai-tradicional", description: "Açaí puro batido com banana e guaraná", price: 16.90, stock: 45, featured: true, category: "acai", size: "500ml", ingredients: "Açaí, banana, guaraná em pó", preparationTime: 10 },
  { name: "Açaí com Banana e Morango", slug: "acai-banana-morango", description: "Açaí cremoso com banana, morango e granola", price: 19.90, stock: 35, featured: false, category: "acai", size: "500ml", ingredients: "Açaí, banana, morango, granola, leite condensado", preparationTime: 10 },
  { name: "Açaí Premium", slug: "acai-premium", description: "Açaí premium com banana, morango, kiwi e granola", price: 24.90, stock: 25, featured: true, category: "acai", size: "700ml", ingredients: "Açaí, banana, morango, kiwi, granola, leite condensado", preparationTime: 12 },
  { name: "Açaí 300ml", slug: "acai-300ml", description: "Açaí tradicional em porção individual", price: 12.90, stock: 50, featured: false, category: "acai", size: "300ml", ingredients: "Açaí, banana, guaraná em pó", preparationTime: 8 },
  { name: "Açaí com Leite Ninho", slug: "acai-leite-ninho", description: "Açaí cremoso com leite ninho e banana", price: 21.90, stock: 30, featured: false, category: "acai", size: "500ml", ingredients: "Açaí, banana, leite ninho, granola", preparationTime: 10 },

  // MILKSHAKES (5)
  { name: "Milkshake de Nutella", slug: "milkshake-nutella", description: "Milkshake cremoso com Nutella e sorvete de baunilha", price: 23.90, stock: 20, featured: true, category: "milkshake", size: "600ml", ingredients: "Sorvete de baunilha, Nutella, leite, chantilly", preparationTime: 8 },
  { name: "Milkshake de Ovomaltine", slug: "milkshake-ovomaltine", description: "Milkshake cremoso com Ovomaltine crocante", price: 21.90, stock: 25, featured: false, category: "milkshake", size: "600ml", ingredients: "Sorvete de chocolate, Ovomaltine, leite, chantilly", preparationTime: 8 },
  { name: "Milkshake de Morango", slug: "milkshake-morango", description: "Milkshake refrescante de morango natural", price: 19.90, stock: 30, featured: false, category: "milkshake", size: "600ml", ingredients: "Sorvete de morango, morango fresco, leite, chantilly", preparationTime: 8 },
  { name: "Milkshake de Chocolate", slug: "milkshake-chocolate", description: "Milkshake cremoso de chocolate belga", price: 21.90, stock: 25, featured: true, category: "milkshake", size: "600ml", ingredients: "Sorvete de chocolate, chocolate belga, leite, chantilly", preparationTime: 8 },
  { name: "Milkshake de Paçoca", slug: "milkshake-pacoca", description: "Milkshake cremoso com paçoca triturada", price: 23.90, stock: 20, featured: true, category: "milkshake", size: "600ml", ingredients: "Sorvete de baunilha, paçoca, leite, chantilly", preparationTime: 8 },

  // SUNDAES (5)
  { name: "Sundae Chocolate", slug: "sundae-chocolate", description: "Sundae clássico com sorvete e calda de chocolate", price: 18.90, stock: 30, featured: false, category: "sundae", size: "400ml", ingredients: "Sorvete de baunilha, calda de chocolate, chantilly", preparationTime: 8 },
  { name: "Sundae Morango", slug: "sundae-morango", description: "Sundae refrescante com calda de morango", price: 18.90, stock: 25, featured: false, category: "sundae", size: "400ml", ingredients: "Sorvete de baunilha, calda de morango, chantilly", preparationTime: 8 },
  { name: "Sundae Nutella", slug: "sundae-nutella", description: "Sundae premium com Nutella e banana", price: 22.90, stock: 20, featured: true, category: "sundae", size: "400ml", ingredients: "Sorvete de baunilha, Nutella, banana, chantilly", preparationTime: 8 },
  { name: "Banana Split", slug: "banana-split", description: "O clássico banana split com três sorvetes", price: 26.90, stock: 15, featured: true, category: "sundae", size: "600ml", ingredients: "Banana, sorvete de chocolate, baunilha, morango, caldas, chantilly", preparationTime: 10 },
  { name: "Sundae Premium", slug: "sundae-premium", description: "Sundae gourmet com toppings especiais", price: 24.90, stock: 15, featured: false, category: "sundae", size: "500ml", ingredients: "Sorvete, Nutella, morango, granola, chantilly", preparationTime: 10 },

  // PICOLÉS (5)
  { name: "Picolé de Morango", slug: "picole-morango", description: "Picolé artesanal de morango natural", price: 5.90, stock: 40, featured: false, category: "picole", size: "100ml", ingredients: "Morango, açúcar, água", preparationTime: 2 },
  { name: "Picolé de Limão", slug: "picole-limao", description: "Picolé refrescante de limão siciliano", price: 5.90, stock: 40, featured: false, category: "picole", size: "100ml", ingredients: "Limão, açúcar, água", preparationTime: 2 },
  { name: "Picolé de Chocolate", slug: "picole-chocolate", description: "Picolé cremoso de chocolate", price: 6.90, stock: 35, featured: false, category: "picole", size: "100ml", ingredients: "Chocolate, leite, açúcar", preparationTime: 2 },
  { name: "Picolé de Coco", slug: "picole-coco", description: "Picolé tropical de coco", price: 5.90, stock: 35, featured: false, category: "picole", size: "100ml", ingredients: "Coco, leite, açúcar", preparationTime: 2 },
  { name: "Picolé de Uva", slug: "picole-uva", description: "Picolé refrescante de uva", price: 5.90, stock: 40, featured: false, category: "picole", size: "100ml", ingredients: "Uva, açúcar, água", preparationTime: 2 },

  // BOLOS (5)
  { name: "Petit Gateau com Sorvete", slug: "petit-gateau", description: "Petit gateau quente com sorvete de creme", price: 32.90, stock: 15, featured: true, category: "bolo", size: "Porção", ingredients: "Chocolate belga, manteiga, ovos, farinha, sorvete", preparationTime: 15 },
  { name: "Brownie Supreme", slug: "brownie-supreme", description: "Brownie de chocolate com sorvete e calda", price: 28.90, stock: 20, featured: false, category: "bolo", size: "Porção", ingredients: "Chocolate, manteiga, ovos, farinha, sorvete, calda", preparationTime: 10 },
  { name: "Bolo de Chocolate", slug: "bolo-chocolate", description: "Fatia de bolo de chocolate com ganache", price: 18.90, stock: 25, featured: false, category: "bolo", size: "Fatia", ingredients: "Chocolate, farinha, ovos, manteiga, ganache", preparationTime: 5 },
  { name: "Bolo de Cenoura", slug: "bolo-cenoura", description: "Fatia de bolo de cenoura com cobertura de chocolate", price: 16.90, stock: 25, featured: false, category: "bolo", size: "Fatia", ingredients: "Cenoura, farinha, ovos, chocolate", preparationTime: 5 },
  { name: "Cheesecake", slug: "cheesecake", description: "Cheesecake cremoso com calda de frutas vermelhas", price: 22.90, stock: 15, featured: true, category: "bolo", size: "Fatia", ingredients: "Cream cheese, biscoito, frutas vermelhas", preparationTime: 5 },

  // BEBIDAS (5)
  { name: "Suco de Laranja", slug: "suco-laranja", description: "Suco natural de laranja espremida na hora", price: 7.90, stock: 50, featured: false, category: "bebida", size: "400ml", ingredients: "Laranja natural", preparationTime: 3 },
  { name: "Limonada Suíça", slug: "limonada-suica", description: "Limonada cremosa com leite condensado", price: 8.90, stock: 40, featured: false, category: "bebida", size: "400ml", ingredients: "Limão, leite condensado, água, açúcar", preparationTime: 3 },
  { name: "Água Mineral", slug: "agua-mineral", description: "Água mineral natural 500ml", price: 3.90, stock: 100, featured: false, category: "bebida", size: "500ml", ingredients: "Água mineral", preparationTime: 1 },
  { name: "Guaraná Antarctica", slug: "guarana", description: "Guaraná Antarctica 350ml", price: 5.90, stock: 60, featured: false, category: "bebida", size: "350ml", ingredients: "Guaraná", preparationTime: 1 },
  { name: "Café Espresso", slug: "cafe-espresso", description: "Café espresso duplo", price: 7.90, stock: 50, featured: false, category: "bebida", size: "60ml", ingredients: "Café torrado", preparationTime: 3 },

  // COMBOS (5)
  { name: "Combo Família", slug: "combo-familia", description: "4 scoops + 2 milkshakes + 1 sundae", price: 49.90, stock: 10, featured: true, category: "combo", size: "Para 4 pessoas", ingredients: "Sorvetes variados, milkshakes, sundae", preparationTime: 15 },
  { name: "Combo Duplo", slug: "combo-duplo", description: "2 scoops + 1 milkshake", price: 29.90, stock: 20, featured: false, category: "combo", size: "Para 2 pessoas", ingredients: "Sorvetes variados, milkshake", preparationTime: 10 },
  { name: "Combo Kids", slug: "combo-kids", description: "1 scoop + 1 picolé + 1 suco", price: 19.90, stock: 25, featured: true, category: "combo", size: "Para 1 criança", ingredients: "Sorvete, picolé, suco", preparationTime: 8 },
  { name: "Combo Premium", slug: "combo-premium", description: "3 scoops gelato + 2 milkshakes premium", price: 59.90, stock: 10, featured: true, category: "combo", size: "Para 3 pessoas", ingredients: "Gelatos variados, milkshakes premium", preparationTime: 12 },
  { name: "Combo Amigos", slug: "combo-amigos", description: "3 scoops + 3 bebidas", price: 39.90, stock: 15, featured: false, category: "combo", size: "Para 3 pessoas", ingredients: "Sorvetes variados, bebidas", preparationTime: 10 },

  // KIDS (5)
  { name: "Casquinha Tradicional", slug: "casquinha-tradicional", description: "Casquinha com 1 scoop de sorvete", price: 8.90, stock: 50, featured: false, category: "kids", size: "Porção", ingredients: "Casquinha de wafer, sorvete", preparationTime: 3 },
  { name: "Cone com 2 Scoops", slug: "cone-2-scoops", description: "Cone com 2 scoops de sorvete", price: 12.90, stock: 40, featured: false, category: "kids", size: "Porção", ingredients: "Cone, sorvetes variados", preparationTime: 3 },
  { name: "Sorvete Palito", slug: "sorvete-palito", description: "Sorvete em palito de frutas", price: 4.90, stock: 60, featured: false, category: "kids", size: "80ml", ingredients: "Frutas, açúcar, água", preparationTime: 1 },
  { name: "Mini Sundae", slug: "mini-sundae", description: "Mini sundae com 1 scoop e calda", price: 10.90, stock: 30, featured: false, category: "kids", size: "200ml", ingredients: "Sorvete, calda, chantilly", preparationTime: 5 },
  { name: "Tigelinha de Sorvete", slug: "tigelinha-sorvete", description: "Tigelinha com 2 scoops e cobertura", price: 11.90, stock: 35, featured: false, category: "kids", size: "250ml", ingredients: "Sorvetes variados, cobertura", preparationTime: 5 },
];

async function uploadImage(url: string, folder: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `gelato/${folder}`,
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${url}:`, error);
    return url; // Fallback to original URL
  }
}

async function main() {
  console.log("🗑️  Deleting existing products and images...");
  // Delete in order to respect foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.promotionProduct.deleteMany();
  await prisma.productCustomization.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  console.log("✅ Existing products deleted");

  console.log("\n📁 Creating categories...");
  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, sortOrder: cat.sortOrder },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
    console.log(`  ✅ ${cat.name}`);
  }

  console.log("\n🍦 Creating products with Cloudinary images...");
  let imageIndex: Record<string, number> = {};
  let totalImages = 0;

  for (const product of products) {
    const categoryId = categoryMap[product.category];
    if (!categoryId) {
      console.error(`  ❌ Category not found: ${product.category}`);
      continue;
    }

    // Get next image for this category
    if (!imageIndex[product.category]) imageIndex[product.category] = 0;
    const imgs = imageUrls[product.category] || imageUrls.scoops;
    const imgUrl = imgs[imageIndex[product.category] % imgs.length];
    imageIndex[product.category]++;

    // Upload to Cloudinary
    process.stdout.write(`  ⏳ Uploading ${product.name}...`);
    const cloudUrl = await uploadImage(imgUrl, product.category);
    totalImages++;

    // Create product
    const created = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        size: product.size,
        ingredients: product.ingredients,
        preparationTime: product.preparationTime,
        stock: product.stock,
        available: true,
        featured: product.featured,
        promotion: false,
        categoryId,
      },
    });

    // Create product image
    await prisma.productImage.create({
      data: {
        url: cloudUrl,
        alt: product.name,
        sortOrder: 0,
        productId: created.id,
      },
    });

    console.log(` ✅`);
  }

  console.log(`\n📊 Report:`);
  console.log(`  - Categories: ${categories.length}`);
  console.log(`  - Products: ${products.length}`);
  console.log(`  - Images uploaded: ${totalImages}`);
  console.log(`\n✅ Catalog rebuild complete!`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
