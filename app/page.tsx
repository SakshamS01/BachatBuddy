import { Navbar } from "@/components/navbar";
import { LandingPage } from "@/components/landing-page";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <LandingPage />
    </main>
  );
}
