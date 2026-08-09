"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PiggyBank,
  TrendingUp,
  Bell,
  Shield,
  ChartPie,
  Lightbulb,
  Upload,
  Play,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: ChartPie,
    title: "Expense Tracking",
    description:
      "Automatically categorize and track all your expenses with smart insights.",
  },
  {
    icon: Bell,
    title: "Subscription Detection",
    description:
      "Identify recurring payments and find subscriptions you might have forgotten.",
  },
  {
    icon: TrendingUp,
    title: "Spending Analysis",
    description:
      "Get detailed breakdowns of where your money goes each month.",
  },
  {
    icon: Lightbulb,
    title: "Smart Insights",
    description:
      "Receive personalized suggestions to optimize your spending habits.",
  },
  {
    icon: PiggyBank,
    title: "Savings Optimization",
    description:
      "Calculate potential savings and project your yearly savings growth.",
  },
  {
    icon: Shield,
    title: "Investment Guidance",
    description:
      "Get simple investment suggestions based on your savings capacity.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />

        <div className="mx-auto max-w-4xl text-center">
          {/* Tagline */}
          <p className="mb-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Aaj control, kal secure.
          </p>

          {/* Main Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Track. Analyze. Save.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Turn your spending into smarter financial decisions. BachatBuddy
            helps you understand your money and find hidden savings.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 text-base">
                <Upload className="h-5 w-5" />
                Upload Transactions
              </Button>
            </Link>
            <Link href="/dashboard?demo=true">
              <Button variant="outline" size="lg" className="gap-2 text-base">
                <Play className="h-5 w-5" />
                Try Demo Data
              </Button>
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="mt-8 text-sm text-muted-foreground">
            Your data stays secure with Firebase. No card required.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Everything you need to manage your finances
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From tracking daily expenses to planning investments, BachatBuddy
              provides all the tools you need for financial wellness.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border bg-card transition-shadow hover:shadow-md"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              How it works
            </h2>
            <p className="text-muted-foreground">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload Data",
                description:
                  "Import your transactions via CSV or JSON file, or try our demo data.",
              },
              {
                step: "2",
                title: "Get Analysis",
                description:
                  "Our AI analyzes your spending patterns and detects subscriptions.",
              },
              {
                step: "3",
                title: "Save More",
                description:
                  "Follow personalized insights to optimize spending and grow savings.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                {index < 2 && (
                  <ArrowRight className="absolute -right-4 top-6 hidden h-6 w-6 text-muted-foreground/50 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-primary/5 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Ready to take control of your finances?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of users who are saving more with BachatBuddy.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <PiggyBank className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">BachatBuddy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with Firebase for secure data handling.
          </p>
        </div>
      </footer>
    </div>
  );
}
