"use client";

import { useState } from "react";
import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/finance-utils";
import { 
  Wallet, 
  TrendingUp, 
  PiggyBank,
  IndianRupee,
  Calculator,
  Target,
  ArrowRight,
} from "lucide-react";
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
import { InputSection } from "@/components/dashboard/input-section";

export default function IncomePage() {
  const { summary, hasData, setMonthlyIncome, analyzeData } = useFinance();
  const [newIncome, setNewIncome] = useState("");

  const handleUpdateIncome = () => {
    const amount = parseFloat(newIncome);
    if (!isNaN(amount) && amount > 0) {
      setMonthlyIncome(amount);
      setTimeout(() => analyzeData(), 100);
      setNewIncome("");
    }
  };

  if (!hasData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Income</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track your earnings
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <InputSection />
        </div>
      </div>
    );
  }

  // Mock data for income trend visualization
  const incomeData = [
    { month: "Jan", income: (summary?.income || 0) * 0.95, savings: (summary?.savings || 0) * 0.8 },
    { month: "Feb", income: (summary?.income || 0) * 0.98, savings: (summary?.savings || 0) * 0.85 },
    { month: "Mar", income: (summary?.income || 0), savings: (summary?.savings || 0) * 0.9 },
    { month: "Apr", income: (summary?.income || 0), savings: (summary?.savings || 0) * 0.95 },
    { month: "May", income: (summary?.income || 0) * 1.02, savings: (summary?.savings || 0) * 1.1 },
    { month: "Jun", income: summary?.income || 0, savings: summary?.savings || 0 },
  ];

  const savingsRate = summary?.income 
    ? ((summary.savings / summary.income) * 100).toFixed(1) 
    : "0";

  const optimizedSavingsRate = summary?.income 
    ? ((summary.optimizedSavings / summary.income) * 100).toFixed(1) 
    : "0";

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Income</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and track your monthly earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-primary">
                {formatCurrency(summary?.income || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yearly Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency((summary?.income || 0) * 12)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Projected annual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              After Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.savings || 0) >= 0 ? "text-chart-1" : "text-destructive"}`}>
              {formatCurrency(summary?.savings || 0)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{savingsRate}% savings rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expense Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {summary?.income ? ((summary.totalSpend / summary.income) * 100).toFixed(1) : 0}%
            </div>
            <Progress 
              value={summary?.income ? (summary.totalSpend / summary.income) * 100 : 0} 
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Update Income & Income Breakdown */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Update Income */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Update Income</CardTitle>
                <CardDescription>
                  Change your monthly income amount
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                New Monthly Income
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={newIncome}
                    onChange={(e) => setNewIncome(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button onClick={handleUpdateIncome}>
                  Update
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">Current Income</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatCurrency(summary?.income || 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Income Allocation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <Target className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <CardTitle>Income Allocation</CardTitle>
                <CardDescription>
                  How your income is distributed
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Expenses */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(summary?.totalSpend || 0)}
                </span>
              </div>
              <Progress 
                value={summary?.income ? (summary.totalSpend / summary.income) * 100 : 0} 
                className="h-3 [&>div]:bg-destructive"
              />
            </div>

            {/* Savings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Savings</span>
                <span className="font-medium text-chart-1">
                  {formatCurrency(summary?.savings || 0)}
                </span>
              </div>
              <Progress 
                value={summary?.income ? (summary.savings / summary.income) * 100 : 0} 
                className="h-3 [&>div]:bg-chart-1"
              />
            </div>

            {/* Potential Savings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Potential Savings</span>
                <span className="font-medium text-primary">
                  {formatCurrency(summary?.optimizedSavings || 0)}
                </span>
              </div>
              <Progress 
                value={summary?.income ? (summary.optimizedSavings / summary.income) * 100 : 0} 
                className="h-3"
              />
            </div>

            <div className="rounded-lg bg-chart-1/10 p-4">
              <p className="text-sm font-medium text-chart-1">
                You could save {formatCurrency((summary?.optimizedSavings || 0) - (summary?.savings || 0))} more!
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                By optimizing your subscriptions and spending
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income vs Savings Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Income vs Savings Trend</CardTitle>
              <CardDescription>
                Track how your savings compare to your income over time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={incomeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
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
                  dataKey="income" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Income"
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--chart-1))" 
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                  name="Savings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-chart-1" />
              <span className="text-sm text-muted-foreground">Savings</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
