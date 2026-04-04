import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AddressBook } from "@/components/account/AddressBook"

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" }
  })

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="border-b border-site-border pb-8 mb-12">
          <h1 className="font-cormorant text-4xl font-light">
            Address Book
          </h1>
        </div>
        <AddressBook 
          addresses={addresses} 
          userId={session.user.id} 
        />
      </div>
    </div>
  )
}
