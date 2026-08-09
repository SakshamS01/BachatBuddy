"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/finance-utils";
import { 
  PiggyBank, 
  Target, 
  TrendingUp,
  Sparkles,
  Calendar,
  ArrowRight,
  Check,
} from "lucide-react";
import { InputSection } from "@/components/dashboard/input-section";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function SavingsPage() {
  const { summary, hasData } = useFinance();

  if (!hasData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Savings</h1>
          <p className="mt-1 text-muted-foreground">
            Track your savings goals and progress
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <InputSection />
        </div>
      </div>
    );
  }

  const savingsRate = summary?.income 
    ? ((summary.savings / summary.income) * 100).toFixed(1) 
    : "0";
  
  const optimizedRate = summary?.income 
    ? ((summary.optimizedSavings / summary.income) * 100).toFixed(1) 
    : "0";

  const improvementAmount = (summary?.optimizedSavings || 0) - (summary?.savings || 0);

  // Savings projection data
  const projectionData = [
    { month: "Month 1", current: summary?.savings || 0, optimized: summary?.optimizedSavings || 0 },
    { month: "Month 3", current: (summary?.savings || 0) * 3, optimized: (summary?.optimizedSavings || 0) * 3 },
    { month: "Month 6", current: (summary?.savings || 0) * 6, optimized: (summary?.optimizedSavings || 0) * 6 },
    { month: "Year 1", current: (summary?.savings || 0) * 12, optimized: (summary?.optimizedSavings || 0) * 12 },
    { month: "Year 2", current: (summary?.savings || 0) * 24, optimized: (summary?.optimizedSavings || 0) * 24 },
    { month: "Year 3", current: (summary?.savings || 0) * 36, optimized: (summary?.optimizedSavings || 0) * 36 },
  ];

  // Savings goals (mock data)
  const savingsGoals = [
    { name: "Emergency Fund", target: 300000, current: (summary?.savings || 0) * 6, description: "6 months of expenses" },
    { name: "Vacation Fund", target: 100000, current: (summary?.savings || 0) * 2, description: "Dream vacation" },
    { name: "Gadget Purchase", target: 50000, current: (summary?.savings || 0), description: "New laptop/phone" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Savings</h1>
        <p className="mt-1 text-muted-foreground">
          Track your savings and reach your financial goals
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-chart-1/30 bg-chart-1/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">
              {formatCurrency(summary?.savings || 0)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {savingsRate}% of income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Optimized Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summary?.optimizedSavings || 0)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {optimizedRate}% potential rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yearly Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(summary?.yearlySavingsProjection || 0)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              With optimization
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potential Extra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              +{formatCurrency(improvementAmount)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current vs Optimized & Savings Rate */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Current vs Optimized */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <Target className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <CardTitle>Current vs Optimized</CardTitle>
                <CardDescription>
                  Compare your savings potential
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Savings */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">Current Savings</span>
                </div>
                <span className="text-lg font-bold text-foreground">
                  {formatCurrency(summary?.savings || 0)}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Savings rate</span>
                  <span className="font-medium">{savingsRate}%</span>
                </div>
                <Progress value={parseFloat(savingsRate)} className="mt-1 h-2" />
              </div>
            </div>

            {/* Optimized Savings */}
            <div className="rounded-lg border-2 border-chart-1/30 bg-chart-1/5 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-chart-1" />
                  <span className="font-medium text-chart-1">Optimized Savings</span>
                </div>
                <span className="text-lg font-bold text-chart-1">
                  {formatCurrency(summary?.optimizedSavings || 0)}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Potential rate</span>
                  <span className="font-medium text-chart-1">{optimizedRate}%</span>
                </div>
                <Progress 
                  value={parseFloat(optimizedRate)} 
                  className="mt-1 h-2 [&>div]:bg-chart-1" 
                />
              </div>
            </div>

            {/* Improvement */}
            {improvementAmount > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Monthly Improvement</p>
                    <p className="text-sm text-muted-foreground">
                      By optimizing subscriptions
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">
                  +{formatCurrency(improvementAmount)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Tips */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Savings Tips</CardTitle>
                <CardDescription>
                  Tips to maximize your savings
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Follow the 50/30/20 Rule",
                  description: "50% needs, 30% wants, 20% savings",
                  status: parseFloat(savingsRate) >= 20,
                },
                {
                  title: "Cancel Unused Subscriptions",
                  description: "Review and cut non-essential recurring payments",
                  status: improvementAmount === 0,
                },
                {
                  title: "Build Emergency Fund",
                  description: "Save 3-6 months of expenses",
                  status: (summary?.savings || 0) * 6 >= (summary?.totalSpend || 0) * 3,
                },
                {
                  title: "Automate Your Savings",
                  description: "Set up automatic transfers to savings",
                  status: true,
                },
                {
                  title: "Track All Expenses",
                  description: "Know where every rupee goes",
                  status: true,
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${
                    tip.status 
                      ? "border-chart-1/30 bg-chart-1/5" 
                      : "border-border bg-card"
                  }`}
                >
                  <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
                    tip.status ? "bg-chart-1" : "bg-muted"
                  }`}>
                    {tip.status ? (
                      <Check className="h-3 w-3 text-chart-1-foreground" />
                    ) : (
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{tip.title}</p>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Projection Chart */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
              <TrendingUp className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <CardTitle>Savings Projection</CardTitle>
              <CardDescription>
                Compare your current vs optimized savings over time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="hsl(var(--muted-foreground))" 
                  fillOpacity={1}
                  fill="url(#colorCurrent)"
                  name="Current Rate"
                  strokeDasharray="5 5"
                />
                <Area 
                  type="monotone" 
                  dataKey="optimized" 
                  stroke="hsl(var(--chart-1))" 
                  fillOpacity={1}
                  fill="url(#colorOptimized)"
                  name="Optimized Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-6 border-t-2 border-dashed border-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-1" />
              <span className="text-sm text-muted-foreground">Optimized Rate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>
                Track your progress towards financial goals
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savingsGoals.map((goal, index) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              const remaining = Math.max(goal.target - goal.current, 0);
              const monthsToGoal = summary?.optimizedSavings 
                ? Math.ceil(remaining / summary.optimizedSavings) 
                : 0;

              return (
                <Card key={index} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{goal.name}</h4>
                      <span className={`text-sm font-medium ${
                        progress >= 100 ? "text-chart-1" : "text-muted-foreground"
                      }`}>
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{goal.description}</p>
                    <Progress value={progress} className="mt-3 h-2" />
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                      {remaining > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ~{monthsToGoal} months left
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
