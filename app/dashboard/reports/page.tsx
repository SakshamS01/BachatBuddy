"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/finance-utils";
import { 
  PieChart as PieChartIcon, 
  Download, 
  TrendingUp,
  TrendingDown,
  Calendar,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { InputSection } from "@/components/dashboard/input-section";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function ReportsPage() {
  const { summary, categoryBreakdown, transactions, subscriptions, hasData } = useFinance();

  if (!hasData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-muted-foreground">
            View detailed financial reports and analytics
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <InputSection />
        </div>
      </div>
    );
  }

  // Monthly comparison data
  const monthlyData = [
    { month: "Jan", income: (summary?.income || 0) * 0.95, expenses: (summary?.totalSpend || 0) * 0.85 },
    { month: "Feb", income: (summary?.income || 0) * 0.98, expenses: (summary?.totalSpend || 0) * 0.92 },
    { month: "Mar", income: (summary?.income || 0), expenses: (summary?.totalSpend || 0) * 1.1 },
    { month: "Apr", income: (summary?.income || 0), expenses: (summary?.totalSpend || 0) * 0.95 },
    { month: "May", income: (summary?.income || 0) * 1.02, expenses: (summary?.totalSpend || 0) * 1.05 },
    { month: "Jun", income: summary?.income || 0, expenses: summary?.totalSpend || 0 },
  ];

  // Category chart data
  const categoryData = categoryBreakdown?.map((item, index) => ({
    name: item.name,
    value: item.value,
    fill: COLORS[index % COLORS.length],
  })) || [];

  // Weekly spending pattern
  const weeklyData = [
    { day: "Mon", amount: (summary?.totalSpend || 0) * 0.12 },
    { day: "Tue", amount: (summary?.totalSpend || 0) * 0.15 },
    { day: "Wed", amount: (summary?.totalSpend || 0) * 0.18 },
    { day: "Thu", amount: (summary?.totalSpend || 0) * 0.14 },
    { day: "Fri", amount: (summary?.totalSpend || 0) * 0.20 },
    { day: "Sat", amount: (summary?.totalSpend || 0) * 0.13 },
    { day: "Sun", amount: (summary?.totalSpend || 0) * 0.08 },
  ];

  // Financial health score
  const savingsRate = summary?.income ? (summary.savings / summary.income) * 100 : 0;
  const expenseRatio = summary?.income ? (summary.totalSpend / summary.income) * 100 : 0;
  const healthScore = Math.min(100, Math.max(0, 
    (savingsRate >= 20 ? 40 : savingsRate * 2) + 
    (expenseRatio <= 70 ? 30 : Math.max(0, 30 - (expenseRatio - 70))) +
    30
  ));

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-muted-foreground">
            Detailed financial analytics and insights
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(summary?.income || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(summary?.totalSpend || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(summary?.savings || 0) >= 0 ? "text-chart-1" : "text-destructive"}`}>
              {formatCurrency(summary?.savings || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {transactions?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {healthScore.toFixed(0)}/100
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different reports */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Income vs Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                  Monthly comparison over 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" name="Expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Financial Health */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Health</CardTitle>
                <CardDescription>
                  Your overall financial wellness score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <svg className="absolute h-full w-full -rotate-90 transform">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="hsl(var(--primary))"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(healthScore / 100) * 440} 440`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-foreground">{healthScore.toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">out of 100</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Savings Rate</span>
                    <Badge variant={savingsRate >= 20 ? "default" : "secondary"}>
                      {savingsRate.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Expense Ratio</span>
                    <Badge variant={expenseRatio <= 70 ? "default" : "destructive"}>
                      {expenseRatio.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subscriptions</span>
                    <Badge variant="secondary">
                      {subscriptions?.filter(s => !s.isCancelled).length || 0} active
                    </Badge>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  healthScore >= 70 
                    ? "bg-chart-1/10" 
                    : healthScore >= 50 
                      ? "bg-chart-3/10" 
                      : "bg-destructive/10"
                }`}>
                  <p className={`text-sm font-medium ${
                    healthScore >= 70 
                      ? "text-chart-1" 
                      : healthScore >= 50 
                        ? "text-chart-3" 
                        : "text-destructive"
                  }`}>
                    {healthScore >= 70 
                      ? "Excellent! Your finances are in great shape." 
                      : healthScore >= 50 
                        ? "Good progress! Keep optimizing your spending." 
                        : "Needs attention. Consider reducing expenses."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Savings Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Savings Trend</CardTitle>
                <CardDescription>
                  Your savings trajectory over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData.map((d, i) => ({
                      ...d,
                      savings: d.income - d.expenses,
                    }))}>
                      <defs>
                        <linearGradient id="colorSavingsTrend" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="savings" 
                        stroke="hsl(var(--chart-1))" 
                        fillOpacity={1}
                        fill="url(#colorSavingsTrend)"
                        name="Savings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Spending Pattern */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Spending Pattern</CardTitle>
                <CardDescription>
                  When you spend the most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
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
                      <Bar 
                        dataKey="amount" 
                        name="Spending" 
                        fill="hsl(var(--chart-4))" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  You tend to spend most on <span className="font-medium text-foreground">Fridays</span>. 
                  Consider planning purchases earlier in the week.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Distribution of expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryBreakdown?.map((category, index) => {
                    const percentage = summary
                      ? ((category.value / summary.totalSpend) * 100).toFixed(1)
                      : "0";
                    return (
                      <div key={category.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="text-sm text-foreground">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                          <span className="text-xs text-muted-foreground">({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Expenses</CardTitle>
                <CardDescription>
                  Your largest transactions this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions
                    ?.sort((a, b) => b.amount - a.amount)
                    .slice(0, 8)
                    .map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{transaction.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.category}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-destructive">
                          -{formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
