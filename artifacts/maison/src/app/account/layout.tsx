import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AppLayout } from "@/components/layout/AppLayout"

export default async function AccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <AppLayout>{children}</AppLayout>
}
