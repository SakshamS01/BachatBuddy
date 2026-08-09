"use client";

import { useFinance } from "@/contexts/finance-context";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { InsightsPanel } from "@/components/dashboard/insights-panel";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { LoadingState } from "@/components/dashboard/loading-state";
import { InputSection } from "@/components/dashboard/input-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, ArrowRight, TrendingUp, PiggyBank, CreditCard } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/finance-utils";

export default function DashboardPage() {
  const { 
    hasData, 
    isAnalyzing, 
    resetData,
    summary,
    subscriptions,
  } = useFinance();

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            {hasData
              ? "Your financial overview at a glance"
              : "Start by adding your income and transactions"}
          </p>
        </div>
        {hasData && (
          <Button variant="outline" onClick={resetData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Data
          </Button>
        )}
      </div>

      {/* Loading State */}
      {isAnalyzing && <LoadingState />}

      {/* Show input section if no data */}
      {!hasData && !isAnalyzing && (
        <div className="mx-auto max-w-2xl">
          <InputSection />
        </div>
      )}

      {/* Dashboard content when data is available */}
      {hasData && !isAnalyzing && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <SummaryCards />

          {/* Quick Stats Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Subscriptions Quick View */}
            <Card className="border-chart-4/30 bg-chart-4/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-chart-4" />
                    <CardTitle className="text-base">Subscriptions</CardTitle>
                  </div>
                  <Link href="/dashboard/subscriptions">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View All <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {subscriptions?.length || 0} active
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(summary?.subscriptionSpend || 0)}/month
                </p>
              </CardContent>
            </Card>

            {/* Savings Quick View */}
            <Card className="border-chart-1/30 bg-chart-1/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5 text-chart-1" />
                    <CardTitle className="text-base">Savings</CardTitle>
                  </div>
                  <Link href="/dashboard/savings">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View All <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {summary ? `${((summary.savings / summary.income) * 100).toFixed(0)}%` : "0%"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(summary?.savings || 0)} this month
                </p>
              </CardContent>
            </Card>

            {/* Investments Quick View */}
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Investments</CardTitle>
                  </div>
                  <Link href="/dashboard/investments">
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      View All <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(summary?.yearlySavingsProjection || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Yearly projection
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main content grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Expense Chart */}
            <ExpenseChart />
            
            {/* Insights Panel */}
            <InsightsPanel />
          </div>

          {/* Recent Transactions */}
          <TransactionList />
        </div>
      )}
    </div>
  );
}
