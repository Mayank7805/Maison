import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/account/ProfileForm"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="border-b border-site-border pb-8 mb-12">
          <h1 className="font-cormorant text-4xl font-light">
            Profile Details
          </h1>
        </div>
        <ProfileForm user={session.user} />
      </div>
    </div>
  )
}
