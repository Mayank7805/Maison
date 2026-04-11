import Account from "@/views/Account";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AccountPage() { 
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <Account />; 
}
