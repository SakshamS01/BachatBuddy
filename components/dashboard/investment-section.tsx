"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/finance-utils";
import { TrendingUp, Wallet, Shield, Lightbulb, ArrowRight } from "lucide-react";

const investmentLevelConfig = {
  low: {
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
    borderColor: "border-chart-4/30",
    label: "Starter",
  },
  medium: {
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
    borderColor: "border-chart-2/30",
    label: "Growing",
  },
  high: {
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
    borderColor: "border-chart-1/30",
    label: "Advanced",
  },
};

const investmentOptions = {
  low: [
    { name: "Recurring Deposit (RD)", risk: "Very Low", returns: "5-6% p.a." },
    { name: "Small SIP", risk: "Low", returns: "8-12% p.a." },
  ],
  medium: [
    { name: "Mutual Fund SIP", risk: "Medium", returns: "12-15% p.a." },
    { name: "Index Funds", risk: "Medium", returns: "10-14% p.a." },
    { name: "PPF", risk: "Very Low", returns: "7.1% p.a." },
  ],
  high: [
    { name: "Diversified SIP Portfolio", risk: "Medium", returns: "12-18% p.a." },
    { name: "Direct Stocks", risk: "High", returns: "Variable" },
    { name: "NPS", risk: "Low-Medium", returns: "9-12% p.a." },
    { name: "ELSS Funds", risk: "Medium", returns: "12-15% p.a." },
  ],
};

export function InvestmentSection() {
  const { investmentSuggestion, summary } = useFinance();

  if (!investmentSuggestion || !summary) return null;

  const config = investmentLevelConfig[investmentSuggestion.level];
  const options = investmentOptions[investmentSuggestion.level];

  const investPercentage = summary.optimizedSavings > 0 
    ? ((investmentSuggestion.investAmount / summary.optimizedSavings) * 100).toFixed(0)
    : "0";

  return (
    <Card className={`border-2 ${config.borderColor}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${config.bgColor}`}>
              <TrendingUp className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Investment Suggestions
                <Badge variant="secondary" className={`${config.bgColor} ${config.color}`}>
                  {config.label}
                </Badge>
              </CardTitle>
              <CardDescription>
                Based on your savings capacity
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main suggestion */}
        <div className={`rounded-lg ${config.bgColor} p-4`}>
          <div className="flex items-start gap-3">
            <Lightbulb className={`mt-0.5 h-5 w-5 shrink-0 ${config.color}`} />
            <p className="text-sm text-foreground">{investmentSuggestion.suggestion}</p>
          </div>
        </div>

        {/* Investment split */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Wallet className={`h-5 w-5 ${config.color}`} />
              <span className="text-sm text-muted-foreground">Invest Monthly</span>
            </div>
            <p className={`mt-2 text-2xl font-bold ${config.color}`}>
              {formatCurrency(investmentSuggestion.investAmount)}
            </p>
            <div className="mt-2">
              <Progress 
                value={parseFloat(investPercentage)} 
                className="h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {investPercentage}% of optimized savings
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Keep as Buffer</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {formatCurrency(investmentSuggestion.bufferAmount)}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Emergency fund + flexibility
            </p>
          </div>
        </div>

        {/* Investment options */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ArrowRight className={`h-4 w-4 ${config.color}`} />
            Recommended Options
          </h4>
          <div className="space-y-2">
            {options.map((option) => (
              <div
                key={option.name}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
              >
                <div>
                  <p className="font-medium text-foreground">{option.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Risk: {option.risk}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {option.returns}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly projection */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Yearly Investment</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(investmentSuggestion.investAmount * 12)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Potential Growth (12% p.a.)</p>
              <p className="text-lg font-semibold text-chart-1">
                +{formatCurrency(investmentSuggestion.investAmount * 12 * 0.12)}
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground">
          * Investment suggestions are for informational purposes only. Please consult a 
          financial advisor before making investment decisions. Past performance does not 
          guarantee future returns.
        </p>
      </CardContent>
    </Card>
  );
}
