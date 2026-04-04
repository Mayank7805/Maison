import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // === USERS ===
  const adminHashed = '$2a$10$WLvCp9Cu0/nxHfI8R2PE3OYH8UlFSVB84GVvLsfpJxB271NRZQg4.'
  const userHashed = '$2a$10$WLvCp9Cu0/nxHfI8R2PE3OYH8UlFSVB84GVvLsfpJxB271NRZQg4.'

  await prisma.user.upsert({
    where: { email: 'admin@maison.com' },
    update: {},
    create: {
      email: 'admin@maison.com',
      name: 'Admin User',
      hashedPassword: adminHashed,
      role: 'ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'test@maison.com' },
    update: {},
    create: {
      email: 'test@maison.com',
      name: 'Test User',
      hashedPassword: userHashed,
      role: 'USER',
    },
  })

  // === CATEGORIES ===
  const clothes = await prisma.category.upsert({
    where: { slug: 'clothes' },
    update: {},
    create: { name: 'Clothes', slug: 'clothes', description: 'Luxury ready-to-wear apparel' },
  })

  const handbags = await prisma.category.upsert({
    where: { slug: 'handbags' },
    update: {},
    create: { name: 'Handbags', slug: 'handbags', description: 'Designer leather goods and bags' },
  })

  const accessories = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: { name: 'Accessories', slug: 'accessories', description: 'Timeless luxury accessories' },
  })

  // === PRODUCTS (Clothes) ===
  const clothesProducts = [
    {
      name: "Silk Organza Trench",
      slug: "silk-organza-trench",
      description: "A translucent take on a classic silhouette crafted from pure silk organza.",
      price: 85000,
      sku: "CL-SOT-001",
      stock: 50,
      images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2672&auto=format&fit=crop"],
      tags: ["silk", "outerwear", "trench"],
      isFeatured: true,
      categoryId: clothes.id,
    },
    {
      name: "Merino Wool Knit Dress",
      slug: "merino-wool-knit-dress",
      description: "Ribbed mid-length dress crafted from ultra-fine Australian merino wool.",
      price: 24000,
      sku: "CL-MWD-002",
      stock: 30,
      images: ["https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=2599&auto=format&fit=crop"],
      tags: ["knit", "dress", "wool"],
      isFeatured: false,
      categoryId: clothes.id,
    },
    {
      name: "Tailored Linen Blazer",
      slug: "tailored-linen-blazer",
      description: "Lightweight structured blazer tailored from Italian linen.",
      price: 45000,
      sku: "CL-TLB-003",
      stock: 20,
      images: ["https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=2574&auto=format&fit=crop"],
      tags: ["blazer", "linen", "tailoring"],
      isFeatured: false,
      categoryId: clothes.id,
    },
    {
      name: "Cashmere Turtleneck",
      slug: "cashmere-turtleneck",
      description: "Essential relaxed-fit sweater crafted from Mongolian cashmere.",
      price: 38000,
      sku: "CL-CTN-004",
      stock: 45,
      images: ["https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=2572&auto=format&fit=crop"],
      tags: ["sweater", "cashmere", "winter"],
      isFeatured: true,
      categoryId: clothes.id,
    }
  ];

  // === PRODUCTS (Handbags) ===
  const handbagProducts = [
    {
      name: "The Signature Leather Tote",
      slug: "signature-leather-tote",
      description: "Everyday luxury tote crafted from full-grain calf leather.",
      price: 65000,
      sku: "HB-SLT-001",
      stock: 15,
      images: ["https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2630&auto=format&fit=crop"],
      tags: ["tote", "leather", "everyday"],
      isFeatured: true,
      categoryId: handbags.id,
    },
    {
      name: "Mini Crossbody Structure",
      slug: "mini-crossbody-structure",
      description: "Architectural mini bag featuring our signature gold hardware.",
      price: 42000,
      sku: "HB-MCS-002",
      stock: 25,
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2669&auto=format&fit=crop"],
      tags: ["mini", "crossbody", "hardware"],
      isFeatured: false,
      categoryId: handbags.id,
    },
    {
      name: "Woven Leather Clutch",
      slug: "woven-leather-clutch",
      description: "Hand-interlaced soft leather evening clutch.",
      price: 52000,
      sku: "HB-WLC-003",
      stock: 10,
      images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2671&auto=format&fit=crop"],
      tags: ["clutch", "evening", "woven"],
      isFeatured: false,
      categoryId: handbags.id,
    },
    {
      name: "Canvas & Leather Weekender",
      slug: "canvas-leather-weekender",
      description: "Spacious travel bag mixing durable canvas and premium leather trims.",
      price: 78000,
      sku: "HB-CLW-004",
      stock: 8,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2787&auto=format&fit=crop"],
      tags: ["travel", "canvas", "weekend"],
      isFeatured: false,
      categoryId: handbags.id,
    }
  ];

  // === PRODUCTS (Accessories) ===
  const accessoryProducts = [
    {
      name: "Oversized Silk Scarf",
      slug: "oversized-silk-scarf",
      description: "100% silk twill square featuring an archival botanical print.",
      price: 18000,
      sku: "AC-OSS-001",
      stock: 60,
      images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2670&auto=format&fit=crop"],
      tags: ["silk", "scarf", "print"],
      isFeatured: false,
      categoryId: accessories.id,
    },
    {
      name: "Signature Gold Cuff",
      slug: "signature-gold-cuff",
      description: "Minimalist 18k gold-plated brass bracelet.",
      price: 28000,
      sku: "AC-SGC-002",
      stock: 40,
      images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2670&auto=format&fit=crop"],
      tags: ["jewelry", "gold", "cuff"],
      isFeatured: true,
      categoryId: accessories.id,
    },
    {
      name: "Classic Acetate Sunglasses",
      slug: "classic-acetate-sunglasses",
      description: "Timeless wayfarer silhouette handmade from Italian acetate.",
      price: 22000,
      sku: "AC-CAS-003",
      stock: 35,
      images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2680&auto=format&fit=crop"],
      tags: ["eyewear", "acetate", "sunglasses"],
      isFeatured: false,
      categoryId: accessories.id,
    },
    {
      name: "Reversible Leather Belt",
      slug: "reversible-leather-belt",
      description: "Versatile smooth leather belt with signature buckle.",
      price: 15000,
      sku: "AC-RLB-004",
      stock: 55,
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=2787&auto=format&fit=crop"], // Placeholder due to limited generic accessory photos
      tags: ["leather", "belt", "reversible"],
      isFeatured: false,
      categoryId: accessories.id,
    }
  ];

  const allProducts = [...clothesProducts, ...handbagProducts, ...accessoryProducts];

  for (const prod of allProducts) {
    const p = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: prod,
    });

    // Create variants if clothes
    if (prod.categoryId === clothes.id) {
      const sizes = ['XS', 'S', 'M', 'L', 'XL'];
      for (const size of sizes) {
        await prisma.productVariant.create({
          data: {
            productId: p.id,
            size,
            stock: Math.floor(Math.random() * 15) + 1, // random 1-15 stock per size
          }
        });
      }
    }
  }

  // === COUPONS ===
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrderAmount: 0 },
  })

  await prisma.coupon.upsert({
    where: { code: 'MAISON20' },
    update: {},
    create: { code: 'MAISON20', type: 'PERCENTAGE', value: 20, minOrderAmount: 10000 },
  })

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: { code: 'FREESHIP', type: 'FIXED', value: 0, minOrderAmount: 0 },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
