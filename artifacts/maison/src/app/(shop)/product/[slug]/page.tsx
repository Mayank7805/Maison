import ProductDetail from "@/views/ProductDetail"
import { prisma } from "@/lib/prisma"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  })

  if (!product) {
    return null
  }

  // Fetch related products (same category, exclude current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isArchived: false,
    },
    include: { category: true },
    take: 4,
  })

  return <ProductDetail initialProduct={product} slug={resolvedParams.slug} relatedProducts={relatedProducts} />
}
