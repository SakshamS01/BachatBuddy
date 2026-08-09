import { Navbar } from "@/components/navbar";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AuthForm mode="signup" />
    </main>
  );
}
