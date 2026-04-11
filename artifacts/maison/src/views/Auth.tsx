"use client";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction, registerAction } from "@/actions/auth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      if (!isLogin) formData.append("name", name);

      const res = isLogin ? await loginAction(formData) : await registerAction(formData);
      if (res?.success) {
        router.push("/account");
        router.refresh();
      } else {
        alert(res?.error || "Error during authentication");
      }
    });
  };

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center bg-cream py-32 px-6">
        <div className="w-full max-w-md bg-white border border-site-border p-10 shadow-sm">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl mb-4">{isLogin ? "Sign In" : "Create Account"}</h1>
            <p className="font-sans text-muted-foreground text-sm">
              {isLogin ? "Welcome back to Maison." : "Join us for exclusive access and tailored curations."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <input 
                  type="text" placeholder="Full Name" required
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
                />
              </div>
            )}
            <div>
              <input 
                type="email" placeholder="Email Address" required
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
              />
            </div>
            <div>
              <input 
                type="password" placeholder="Password" required
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border border-site-border bg-cream p-4 text-sm focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full bg-ink text-white py-4 text-xs tracking-widest hover:bg-gray-800 transition-colors mt-8"
            >
              {isLogin ? "SIGN IN" : "REGISTER"}
            </button>
          </form>

          <div className="border-t border-site-border my-6" />

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-ink transition-colors"
            >
              {isLogin ? "Create an account instead" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
