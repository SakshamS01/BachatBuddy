"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-utils";
import { IndianRupee, TrendingDown, TrendingUp, PiggyBank, Repeat, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export function SummaryCards() {
  const { summary } = useFinance();

  if (!summary) return null;

  // Calculate savings rate
  const savingsRate = summary.income > 0 ? ((summary.savings / summary.income) * 100).toFixed(1) : "0";
  
  const cards = [
    {
      title: "Total Income",
      value: summary.totalCredits || summary.income,
      icon: ArrowDownLeft,
      description: "Money received this month",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      prefix: "+",
    },
    {
      title: "Total Expenses",
      value: summary.totalDebits,
      icon: ArrowUpRight,
      description: "Money spent this month",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      prefix: "-",
    },
    {
      title: "Net Savings",
      value: Math.abs(summary.savings),
      icon: PiggyBank,
      description: `${savingsRate}% savings rate`,
      color: summary.savings >= 0 ? "text-emerald-600" : "text-destructive",
      bgColor: summary.savings >= 0 ? "bg-emerald-100" : "bg-destructive/10",
      prefix: summary.savings >= 0 ? "+" : "-",
    },
    {
      title: "Subscriptions",
      value: summary.subscriptionSpend,
      icon: Repeat,
      description: "Recurring monthly payments",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      prefix: "",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`rounded-lg p-2 ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.prefix}{formatCurrency(card.value)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
