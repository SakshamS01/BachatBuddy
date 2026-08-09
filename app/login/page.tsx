import { Navbar } from "@/components/navbar";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AuthForm mode="login" />
    </main>
  );
}
