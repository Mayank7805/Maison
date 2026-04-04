import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids");
    if (ids) {
      const idArray = ids.split(",");
      const products = await prisma.product.findMany({
        where: { id: { in: idArray } },
        include: { category: true }
      });
      return NextResponse.json({ products });
    }

    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const where: any = { isArchived: false };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { has: query } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    const products = await prisma.product.findMany({
      where,
      take: limit,
      include: {
        category: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
