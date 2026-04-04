import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

import { revalidatePath } from "next/cache"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" }, { status: 401 }
    )
  }

  const { id } = await params
  const data = await req.json()

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      comparePrice: data.comparePrice 
        ? Number(data.comparePrice) 
        : null,
      sku: data.sku,
      stock: Number(data.stock),
      categoryId: data.categoryId,
      images: data.images,
      tags: data.tags,
      isFeatured: data.isFeatured,
      slug: data.slug,
    },
    include: { category: true }
  })

  revalidatePath("/shop")
  revalidatePath("/admin/products")
  revalidatePath(`/product/${product.slug}`)

  return NextResponse.json(product)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" }, { status: 401 }
    )
  }

  const { id } = await params

  await prisma.product.update({
    where: { id },
    data: { isArchived: true },
  })

  return NextResponse.json({ success: true })
}
