import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NewProductPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  const categories = await prisma.category.findMany()

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-cormorant text-4xl font-light">
          Add New Product
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
