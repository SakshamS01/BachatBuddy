"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/finance-utils";
import { PiggyBank, TrendingUp, Target, Sparkles } from "lucide-react";

export function SavingsSection() {
  const { summary } = useFinance();

  if (!summary) return null;

  const savingsRate = summary.income > 0 
    ? ((summary.savings / summary.income) * 100).toFixed(1) 
    : "0";
  
  const optimizedRate = summary.income > 0 
    ? ((summary.optimizedSavings / summary.income) * 100).toFixed(1) 
    : "0";

  const improvementAmount = summary.optimizedSavings - summary.savings;
  const hasImprovement = improvementAmount > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
            <Target className="h-5 w-5 text-chart-1" />
          </div>
          <div>
            <CardTitle>Savings Optimization</CardTitle>
            <CardDescription>
              Your current and optimized savings potential
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current vs Optimized */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Current Savings */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Current Savings</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {formatCurrency(summary.savings)}
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Savings rate</span>
                <span className="font-medium text-foreground">{savingsRate}%</span>
              </div>
              <Progress 
                value={parseFloat(savingsRate)} 
                className="mt-1 h-2" 
              />
            </div>
          </div>

          {/* Optimized Savings */}
          <div className="rounded-lg border-2 border-chart-1/30 bg-chart-1/5 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-chart-1" />
              <span className="text-sm text-chart-1">Optimized Savings</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-chart-1">
              {formatCurrency(summary.optimizedSavings)}
            </p>
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
        </div>

        {/* Improvement callout */}
        {hasImprovement && (
          <div className="flex items-center justify-between rounded-lg bg-chart-1/10 p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-chart-1" />
              <div>
                <p className="font-medium text-foreground">Potential Improvement</p>
                <p className="text-sm text-muted-foreground">
                  By optimizing your subscriptions
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-chart-1">
              +{formatCurrency(improvementAmount)}
            </p>
          </div>
        )}

        {/* Yearly Projection */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Yearly Savings Projection
          </p>
          <p className="mt-2 text-4xl font-bold text-primary">
            {formatCurrency(summary.yearlySavingsProjection)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatCurrency(summary.optimizedSavings)} x 12 months
          </p>
        </div>

        {/* Savings tips */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Quick Tips
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Aim to save at least 20% of your income</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Review subscriptions quarterly to cut waste</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>Automate your savings to stay consistent</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
