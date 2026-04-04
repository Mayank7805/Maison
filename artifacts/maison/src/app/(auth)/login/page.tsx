import { AppLayout } from "@/components/layout/AppLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");
  
  return (
    <AppLayout>
      <LoginForm />
    </AppLayout>
  );
}
