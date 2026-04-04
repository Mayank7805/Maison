import Shop from "@/views/Shop"
import { prisma } from "@/lib/prisma"

export default async function ShopPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    category?: string
    gender?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }> 
}) {
  const params = await searchParams
  
  const where: any = { isArchived: false }
  
  if (params.category) {
    where.category = { 
      slug: params.category 
    }
  }
  
  if (params.minPrice || params.maxPrice) {
    where.price = {}
    if (params.minPrice) 
      where.price.gte = Number(params.minPrice)
    if (params.maxPrice) 
      where.price.lte = Number(params.maxPrice)
  }
  
  const orderBy: any = {}
  if (params.sort === "price_asc") 
    orderBy.price = "asc"
  else if (params.sort === "price_desc") 
    orderBy.price = "desc"
  else orderBy.createdAt = "desc"
  
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true }
  })

  return <Shop initialProducts={products} category={params.category} />
}
