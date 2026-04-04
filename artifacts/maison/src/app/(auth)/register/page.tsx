import { AppLayout } from "@/components/layout/AppLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/");
  
  return (
    <AppLayout>
      <RegisterForm />
    </AppLayout>
  );
}
