import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" }, { status: 401 }
    )
  }

  try {
    const data = await req.json()
    
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug }
    })
    
    if (existing) {
      data.slug = `${data.slug}-${Date.now()}`
    }

    const product = await prisma.product.create({ data })
    return NextResponse.json(product)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, { status: 500 }
    )
  }
}
