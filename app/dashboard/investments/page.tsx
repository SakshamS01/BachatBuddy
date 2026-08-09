"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/finance-utils";
import { 
  TrendingUp, 
  Shield,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  IndianRupee,
  PieChart,
  ArrowRight,
  Check,
} from "lucide-react";
import { InputSection } from "@/components/dashboard/input-section";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function InvestmentsPage() {
  const { summary, investmentSuggestions, hasData } = useFinance();

  if (!hasData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Investments</h1>
          <p className="mt-1 text-muted-foreground">
            Personalized investment suggestions based on your savings
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <InputSection />
        </div>
      </div>
    );
  }

  const monthlyInvestable = summary?.optimizedSavings || 0;
  const yearlyInvestable = monthlyInvestable * 12;

  // Investment growth projection (assuming 12% annual return)
  const projectionData = [
    { year: "Year 0", amount: 0 },
    { year: "Year 1", amount: yearlyInvestable },
    { year: "Year 2", amount: yearlyInvestable * 2.12 },
    { year: "Year 3", amount: yearlyInvestable * 3.37 },
    { year: "Year 5", amount: yearlyInvestable * 6.35 },
    { year: "Year 10", amount: yearlyInvestable * 17.55 },
  ];

  const riskProfiles = [
    {
      name: "Conservative",
      return: "8-10%",
      risk: "Low",
      allocation: [
        { type: "Debt Funds", percent: 60 },
        { type: "Fixed Deposits", percent: 25 },
        { type: "Equity", percent: 15 },
      ],
      color: "chart-2",
    },
    {
      name: "Moderate",
      return: "10-14%",
      risk: "Medium",
      allocation: [
        { type: "Equity Funds", percent: 50 },
        { type: "Debt Funds", percent: 30 },
        { type: "Gold/Real Estate", percent: 20 },
      ],
      color: "chart-3",
    },
    {
      name: "Aggressive",
      return: "14-18%",
      risk: "High",
      allocation: [
        { type: "Equity/Stocks", percent: 70 },
        { type: "Mutual Funds", percent: 20 },
        { type: "Crypto", percent: 10 },
      ],
      color: "primary",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Investments</h1>
        <p className="mt-1 text-muted-foreground">
          Grow your wealth with smart investment strategies
        </p>
      </div>

      {/* Investment Capacity Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Investable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyInvestable)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              After optimizing expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Yearly Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(yearlyInvestable)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Annual investment potential
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              5-Year Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">
              {formatCurrency(yearlyInvestable * 6.35)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              At 12% annual return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              10-Year Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">
              {formatCurrency(yearlyInvestable * 17.55)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Power of compounding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Projection & Risk Profiles */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        {/* Growth Projection Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <div>
                <CardTitle>Growth Projection</CardTitle>
                <CardDescription>
                  Potential wealth accumulation over time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData}>
                  <defs>
                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
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
                    dataKey="amount" 
                    stroke="hsl(var(--chart-1))" 
                    fillOpacity={1}
                    fill="url(#colorGrowth)"
                    name="Portfolio Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              * Projections based on 12% average annual return. Actual returns may vary.
            </p>
          </CardContent>
        </Card>

        {/* Risk Profiles */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Risk Profiles</CardTitle>
                <CardDescription>
                  Choose based on your risk tolerance
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskProfiles.map((profile) => (
              <div
                key={profile.name}
                className={`rounded-lg border p-4 transition-colors hover:bg-muted/50`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground">{profile.name}</h4>
                    <Badge 
                      variant={profile.risk === "Low" ? "secondary" : profile.risk === "High" ? "destructive" : "outline"}
                    >
                      {profile.risk} Risk
                    </Badge>
                  </div>
                  <span className="text-sm font-medium text-chart-1">{profile.return}</span>
                </div>
                <div className="space-y-2">
                  {profile.allocation.map((alloc) => (
                    <div key={alloc.type} className="flex items-center gap-2">
                      <Progress value={alloc.percent} className="h-2 flex-1" />
                      <span className="w-20 text-xs text-muted-foreground">
                        {alloc.type} ({alloc.percent}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Personalized Suggestions */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
              <Sparkles className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <CardTitle>Personalized Suggestions</CardTitle>
              <CardDescription>
                Based on your savings of {formatCurrency(monthlyInvestable)}/month
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {investmentSuggestions && investmentSuggestions.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {investmentSuggestions.map((suggestion, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {suggestion.risk === "Low" ? (
                          <Shield className="h-5 w-5 text-chart-2" />
                        ) : suggestion.risk === "Medium" ? (
                          <TrendingUp className="h-5 w-5 text-chart-3" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <Badge 
                        variant={
                          suggestion.risk === "Low" 
                            ? "secondary" 
                            : suggestion.risk === "High" 
                              ? "destructive" 
                              : "outline"
                        }
                      >
                        {suggestion.risk}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-foreground">{suggestion.type}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{suggestion.reason}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Suggested Amount</p>
                        <p className="font-semibold text-foreground">
                          {formatCurrency(suggestion.suggestedAmount)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Learn More <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Sparkles className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">
                Increase your savings to unlock suggestions
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Save at least 5,000/month to get personalized investment advice.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Tips */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Investment Best Practices</CardTitle>
              <CardDescription>
                Guidelines for successful investing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Start with SIP",
                description: "Systematic Investment Plans reduce market timing risk",
              },
              {
                title: "Diversify Portfolio",
                description: "Spread investments across asset classes",
              },
              {
                title: "Emergency Fund First",
                description: "Keep 6 months expenses before investing",
              },
              {
                title: "Long-term Perspective",
                description: "Stay invested for at least 5-7 years",
              },
              {
                title: "Review Quarterly",
                description: "Rebalance portfolio every 3-6 months",
              },
              {
                title: "Tax-Efficient",
                description: "Utilize ELSS for 80C deductions",
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border border-border p-4"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-3 w-3 text-primary" />
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
  );
}
