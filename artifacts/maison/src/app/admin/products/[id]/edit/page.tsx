import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany(),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-cormorant text-4xl font-light">
          Edit Product
        </h1>
        <p className="font-mono text-xs tracking-widest 
                      text-muted mt-1">
          {product.name.toUpperCase()}
        </p>
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  )
}
