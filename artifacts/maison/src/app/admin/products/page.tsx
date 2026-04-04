import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { AdminProductsTable } from 
  "@/components/admin/AdminProductsTable"

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const products = await prisma.product.findMany({
    where: { isArchived: false },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-cormorant text-4xl font-light">
            Products
          </h1>
          <p className="font-mono text-xs tracking-widest 
                        text-muted mt-1">
            {products.length} PRODUCTS
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink text-white font-mono text-xs 
                     tracking-widest uppercase px-6 py-3
                     hover:bg-gray-800 transition-colors"
        >
          + ADD PRODUCT
        </Link>
      </div>
      <AdminProductsTable products={products} />
    </div>
  )
}
