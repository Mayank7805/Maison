import { db } from "@workspace/db";
import {
  usersTable, categoriesTable, productsTable, couponsTable, reviewsTable
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding MAISON database...");

  // Categories
  const cats = await db.insert(categoriesTable).values([
    {
      name: "Clothes",
      slug: "clothes",
      description: "Elevated ready-to-wear pieces crafted for the modern woman.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
    },
    {
      name: "Handbags",
      slug: "handbags",
      description: "Structured silhouettes and supple leathers for every occasion.",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "The finishing touch — scarves, belts, and jewelry to complete the look.",
      image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
    },
  ]).onConflictDoNothing().returning();

  console.log(`✅ Created ${cats.length} categories`);

  const [clothes, handbags, accessories] = cats.length === 3 ? cats : await Promise.all([
    db.select().from(categoriesTable).where(eq(categoriesTable.slug, "clothes")).then(r => r[0]),
    db.select().from(categoriesTable).where(eq(categoriesTable.slug, "handbags")).then(r => r[0]),
    db.select().from(categoriesTable).where(eq(categoriesTable.slug, "accessories")).then(r => r[0]),
  ]);

  // Products - Clothes
  const clotheProducts = [
    {
      name: "Atelier Silk Blouse",
      slug: "atelier-silk-blouse",
      description: "Draped in pure Japanese silk, this blouse moves with the body. The relaxed collar and barrel cuffs lend an effortlessly polished finish.",
      price: "485.00",
      comparePrice: "650.00",
      sku: "CLT-001",
      stock: 24,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop",
      ],
      tags: ["silk", "blouse", "tops", "ss25"],
      isFeatured: true,
    },
    {
      name: "Côte Tailored Blazer",
      slug: "cote-tailored-blazer",
      description: "A masterclass in tailoring. This single-button blazer is cut from a wool-cashmere blend and falls with architectural precision.",
      price: "1250.00",
      comparePrice: null,
      sku: "CLT-002",
      stock: 18,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1580657018950-c7f7d99a1f3c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop",
      ],
      tags: ["blazer", "tailoring", "outerwear"],
      isFeatured: true,
    },
    {
      name: "Ligne Straight Trousers",
      slug: "ligne-straight-trousers",
      description: "Wide-leg trousers with a high rise and clean pleat. Crafted from Italian crepe for fluid drape.",
      price: "595.00",
      comparePrice: null,
      sku: "CLT-003",
      stock: 30,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=800&auto=format&fit=crop",
      ],
      tags: ["trousers", "pants", "tailoring"],
      isFeatured: false,
    },
    {
      name: "Voile Sheer Dress",
      slug: "voile-sheer-dress",
      description: "A whisper of silk voile layers over a silk slip. The bias cut follows every curve with quiet elegance.",
      price: "820.00",
      comparePrice: "980.00",
      sku: "CLT-004",
      stock: 12,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop",
      ],
      tags: ["dress", "silk", "evening"],
      isFeatured: true,
    },
    {
      name: "Merino Ribbed Turtleneck",
      slug: "merino-ribbed-turtleneck",
      description: "Finely ribbed extra-fine merino wool in a relaxed silhouette. The ideal foundation piece.",
      price: "295.00",
      comparePrice: null,
      sku: "CLT-005",
      stock: 45,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop",
      ],
      tags: ["knitwear", "turtleneck", "merino"],
      isFeatured: false,
    },
    {
      name: "Côte Cashmere Coat",
      slug: "cote-cashmere-coat",
      description: "A full-length double-faced cashmere coat with a sculptural collar. An investment in timeless elegance.",
      price: "3200.00",
      comparePrice: null,
      sku: "CLT-006",
      stock: 8,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&auto=format&fit=crop",
      ],
      tags: ["coat", "cashmere", "outerwear"],
      isFeatured: true,
    },
    {
      name: "Linen Column Skirt",
      slug: "linen-column-skirt",
      description: "A midi-length column skirt in garment-dyed French linen. Minimal, considered, essential.",
      price: "375.00",
      comparePrice: null,
      sku: "CLT-007",
      stock: 22,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=800&auto=format&fit=crop",
      ],
      tags: ["skirt", "linen", "midi"],
      isFeatured: false,
    },
    {
      name: "Poplin Oversized Shirt",
      slug: "poplin-oversized-shirt",
      description: "An oversized silhouette in crisp organic cotton poplin. Understated and endlessly versatile.",
      price: "285.00",
      comparePrice: null,
      sku: "CLT-008",
      stock: 35,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&auto=format&fit=crop",
      ],
      tags: ["shirt", "cotton", "tops"],
      isFeatured: false,
    },
    {
      name: "Velvet Slip Dress",
      slug: "velvet-slip-dress",
      description: "Rich crushed velvet in midnight black. A sculptural neckline and adjustable straps for evenings that call for more.",
      price: "680.00",
      comparePrice: null,
      sku: "CLT-009",
      stock: 14,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1566479179817-bf00f1df8695?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&auto=format&fit=crop",
      ],
      tags: ["dress", "velvet", "evening"],
      isFeatured: false,
    },
    {
      name: "Wool Wide Leg Suit",
      slug: "wool-wide-leg-suit",
      description: "A complete two-piece suit in Italian wool twill. Wide-leg trousers paired with a cropped single-button jacket.",
      price: "1650.00",
      comparePrice: null,
      sku: "CLT-010",
      stock: 10,
      categoryId: clothes.id,
      images: [
        "https://images.unsplash.com/photo-1600717707820-a5571d2e14db?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop",
      ],
      tags: ["suit", "wool", "tailoring"],
      isFeatured: true,
    },
  ];

  // Products - Handbags
  const handbagProducts = [
    {
      name: "Arc Structured Tote",
      slug: "arc-structured-tote",
      description: "Vegetable-tanned calf leather with a curved silhouette. Brass hardware and a detachable card holder.",
      price: "1850.00",
      comparePrice: null,
      sku: "HBG-001",
      stock: 15,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
      ],
      tags: ["tote", "leather", "work"],
      isFeatured: true,
    },
    {
      name: "Minette Shoulder Bag",
      slug: "minette-shoulder-bag",
      description: "A compact shoulder bag in grained leather with a chain strap. The magnetic clasp closure adds a refined touch.",
      price: "980.00",
      comparePrice: "1200.00",
      sku: "HBG-002",
      stock: 20,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop",
      ],
      tags: ["shoulder bag", "leather", "chain"],
      isFeatured: true,
    },
    {
      name: "Carré Clutch",
      slug: "carre-clutch",
      description: "An envelope clutch in smooth nappa leather. The geometric hardware closure is signature MAISON.",
      price: "645.00",
      comparePrice: null,
      sku: "HBG-003",
      stock: 18,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop",
      ],
      tags: ["clutch", "evening", "leather"],
      isFeatured: false,
    },
    {
      name: "Boucle Crossbody",
      slug: "boucle-crossbody",
      description: "Boucle tweed with leather trim. A long adjustable strap for a casual-luxe carry.",
      price: "785.00",
      comparePrice: null,
      sku: "HBG-004",
      stock: 12,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
      ],
      tags: ["crossbody", "boucle", "casual"],
      isFeatured: false,
    },
    {
      name: "Grand Arc Weekender",
      slug: "grand-arc-weekender",
      description: "The oversized version of our iconic Arc. Supple tumbled leather with a top-zip closure and interior organization.",
      price: "2400.00",
      comparePrice: null,
      sku: "HBG-005",
      stock: 8,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
      ],
      tags: ["weekender", "leather", "travel"],
      isFeatured: false,
    },
    {
      name: "Nano Arc Mini Bag",
      slug: "nano-arc-mini-bag",
      description: "The collectible mini — compact yet structured. Fits a card holder and essentials with a sleek chain strap.",
      price: "890.00",
      comparePrice: null,
      sku: "HBG-006",
      stock: 25,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop",
      ],
      tags: ["mini", "evening", "leather"],
      isFeatured: true,
    },
    {
      name: "Plissé Leather Tote",
      slug: "plisse-leather-tote",
      description: "Hand-pleated lambskin leather in an expansive tote format. The pleating technique is entirely handcrafted.",
      price: "3100.00",
      comparePrice: null,
      sku: "HBG-007",
      stock: 6,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
      ],
      tags: ["tote", "lambskin", "artisan"],
      isFeatured: false,
    },
    {
      name: "Satin Evening Bag",
      slug: "satin-evening-bag",
      description: "A gathered satin evening bag with a slim chain strap. The gathered silhouette is effortlessly feminine.",
      price: "520.00",
      comparePrice: "680.00",
      sku: "HBG-008",
      stock: 16,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
      ],
      tags: ["evening", "satin", "chain"],
      isFeatured: false,
    },
    {
      name: "Suede Hobo",
      slug: "suede-hobo",
      description: "Butter-soft suede in a generous hobo silhouette. The braided leather strap adds artisanal texture.",
      price: "1150.00",
      comparePrice: null,
      sku: "HBG-009",
      stock: 14,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&auto=format&fit=crop",
      ],
      tags: ["hobo", "suede", "casual"],
      isFeatured: false,
    },
    {
      name: "Trapeze Bag",
      slug: "trapeze-bag",
      description: "A sculptural trapeze silhouette in smooth calfskin. The rounded base and flat top create a distinctive profile.",
      price: "1480.00",
      comparePrice: null,
      sku: "HBG-010",
      stock: 10,
      categoryId: handbags.id,
      images: [
        "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop",
      ],
      tags: ["structured", "calfskin", "iconic"],
      isFeatured: true,
    },
  ];

  // Products - Accessories
  const accessoryProducts = [
    {
      name: "Silk Carré Scarf",
      slug: "silk-carre-scarf",
      description: "A 90×90cm hand-rolled silk scarf printed with an original MAISON motif. Each piece is hand-finished by artisans.",
      price: "295.00",
      comparePrice: null,
      sku: "ACC-001",
      stock: 40,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617957771002-ed8c40f96b6e?w=800&auto=format&fit=crop",
      ],
      tags: ["scarf", "silk", "accessories"],
      isFeatured: true,
    },
    {
      name: "Leather Cinch Belt",
      slug: "leather-cinch-belt",
      description: "A wide leather belt with a polished gold buckle. The perfect waist-defining addition to any ensemble.",
      price: "285.00",
      comparePrice: null,
      sku: "ACC-002",
      stock: 30,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1624925681779-5e5e4a09eab3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
      ],
      tags: ["belt", "leather", "accessories"],
      isFeatured: false,
    },
    {
      name: "Pearl Drop Earrings",
      slug: "pearl-drop-earrings",
      description: "Baroque freshwater pearls set in 18k gold vermeil. The asymmetric drop adds movement with quiet drama.",
      price: "380.00",
      comparePrice: "450.00",
      sku: "ACC-003",
      stock: 22,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1617957771002-ed8c40f96b6e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop",
      ],
      tags: ["earrings", "pearl", "jewelry"],
      isFeatured: true,
    },
    {
      name: "Cashmere Beret",
      slug: "cashmere-beret",
      description: "An oversized beret in pure cashmere. Effortlessly French, endlessly wearable.",
      price: "185.00",
      comparePrice: null,
      sku: "ACC-004",
      stock: 35,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1574180048747-dc14f5e6b7e7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
      ],
      tags: ["hat", "cashmere", "accessories"],
      isFeatured: false,
    },
    {
      name: "Gold Chain Bracelet",
      slug: "gold-chain-bracelet",
      description: "A double-link chain in solid 18k gold. Substantial yet refined.",
      price: "1200.00",
      comparePrice: null,
      sku: "ACC-005",
      stock: 12,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617957771002-ed8c40f96b6e?w=800&auto=format&fit=crop",
      ],
      tags: ["bracelet", "gold", "jewelry"],
      isFeatured: false,
    },
    {
      name: "Merino Cashmere Gloves",
      slug: "merino-cashmere-gloves",
      description: "Lined in silk with a cashmere exterior. The touchscreen-compatible fingertips are a modern refinement.",
      price: "145.00",
      comparePrice: null,
      sku: "ACC-006",
      stock: 28,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574180048747-dc14f5e6b7e7?w=800&auto=format&fit=crop",
      ],
      tags: ["gloves", "cashmere", "accessories"],
      isFeatured: false,
    },
    {
      name: "Silk Hair Bow",
      slug: "silk-hair-bow",
      description: "A sculptural hair bow in bias-cut silk satin. The oversized silhouette makes a quiet statement.",
      price: "95.00",
      comparePrice: null,
      sku: "ACC-007",
      stock: 50,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1617957771002-ed8c40f96b6e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
      ],
      tags: ["hair", "silk", "accessories"],
      isFeatured: false,
    },
    {
      name: "Tortoiseshell Sunglasses",
      slug: "tortoiseshell-sunglasses",
      description: "Oversized oval frames in bio-acetate with gradient lenses. UV400 protection.",
      price: "320.00",
      comparePrice: "395.00",
      sku: "ACC-008",
      stock: 18,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
      ],
      tags: ["sunglasses", "eyewear", "accessories"],
      isFeatured: true,
    },
    {
      name: "Narrow Leather Gloves",
      slug: "narrow-leather-gloves",
      description: "Fine nappa leather gloves with a three-button closure. A staple of understated elegance.",
      price: "195.00",
      comparePrice: null,
      sku: "ACC-009",
      stock: 20,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1624925681779-5e5e4a09eab3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&auto=format&fit=crop",
      ],
      tags: ["gloves", "leather", "accessories"],
      isFeatured: false,
    },
    {
      name: "Structured Headband",
      slug: "structured-headband",
      description: "A velvet-wrapped headband with a sculptural silhouette. The padded interior provides comfort.",
      price: "125.00",
      comparePrice: null,
      sku: "ACC-010",
      stock: 32,
      categoryId: accessories.id,
      images: [
        "https://images.unsplash.com/photo-1574180048747-dc14f5e6b7e7?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617957771002-ed8c40f96b6e?w=800&auto=format&fit=crop",
      ],
      tags: ["headband", "velvet", "accessories"],
      isFeatured: false,
    },
  ];

  const allProducts = [...clotheProducts, ...handbagProducts, ...accessoryProducts];
  const insertedProducts = await db.insert(productsTable).values(allProducts).onConflictDoNothing().returning();
  console.log(`✅ Created ${insertedProducts.length} products`);

  // Users
  const adminHash = await bcrypt.hash("admin123", 12);
  const userHash = await bcrypt.hash("user123", 12);

  const users = await db.insert(usersTable).values([
    {
      name: "MAISON Admin",
      email: "admin@maison.com",
      passwordHash: adminHash,
      role: "ADMIN" as const,
    },
    {
      name: "Sophie Laurent",
      email: "sophie@example.com",
      passwordHash: userHash,
      role: "USER" as const,
    },
    {
      name: "Emma Whitfield",
      email: "emma@example.com",
      passwordHash: userHash,
      role: "USER" as const,
    },
  ]).onConflictDoNothing().returning();

  console.log(`✅ Created ${users.length} users`);

  // Reviews
  const products = await db.select().from(productsTable).limit(6);
  const regularUsers = users.filter(u => u.role === "USER");

  if (products.length > 0 && regularUsers.length > 0) {
    const reviewData = [];
    for (const product of products.slice(0, 4)) {
      for (const user of regularUsers) {
        reviewData.push({
          userId: user.id,
          productId: product.id,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: [
            "Absolutely exquisite quality. The craftsmanship is evident in every detail.",
            "Worth every penny. This piece has become a wardrobe staple.",
            "The fit is perfect and the material is divine. MAISON never disappoints.",
            "Impeccable quality. I receive compliments every time I wear this.",
          ][Math.floor(Math.random() * 4)],
        });
      }
    }
    await db.insert(reviewsTable).values(reviewData).onConflictDoNothing();
    console.log(`✅ Created ${reviewData.length} reviews`);
  }

  // Coupons
  await db.insert(couponsTable).values([
    { code: "MAISON10", type: "PERCENT", value: "10.00", minOrder: "200.00", maxUses: 100, isActive: "true" },
    { code: "WELCOME20", type: "PERCENT", value: "20.00", minOrder: "100.00", maxUses: 50, isActive: "true" },
    { code: "SAVE50", type: "FIXED", value: "50.00", minOrder: "300.00", isActive: "true" },
  ]).onConflictDoNothing();

  console.log("✅ Created coupons");
  console.log("🎉 Seeding complete!");
  console.log("\nAdmin credentials:");
  console.log("  Email: admin@maison.com");
  console.log("  Password: admin123");
  console.log("\nTest user credentials:");
  console.log("  Email: sophie@example.com");
  console.log("  Password: user123");
  console.log("\nCoupon codes: MAISON10, WELCOME20, SAVE50");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
