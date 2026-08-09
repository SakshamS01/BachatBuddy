"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-utils";
import { useMemo } from "react";
import { 
  Lightbulb, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  Utensils,
  ShoppingBag,
  Zap,
} from "lucide-react";

const insightIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  suggestion: Sparkles,
};

const insightColors = {
  info: {
    bg: "bg-chart-2/10",
    border: "border-chart-2/30",
    icon: "text-chart-2",
    text: "text-chart-2",
  },
  warning: {
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: "text-destructive",
    text: "text-destructive",
  },
  success: {
    bg: "bg-chart-1/10",
    border: "border-chart-1/30",
    icon: "text-chart-1",
    text: "text-chart-1",
  },
  suggestion: {
    bg: "bg-chart-4/10",
    border: "border-chart-4/30",
    icon: "text-chart-4",
    text: "text-chart-4",
  },
};

interface DynamicInsight {
  id: string;
  type: "info" | "warning" | "success" | "suggestion";
  message: string;
  actionable?: boolean;
  savings?: number;
  icon?: typeof Info;
}

export function InsightsPanel() {
  const { transactions, subscriptions, categoryBreakdown, summary } = useFinance();

  // Generate dynamic insights based on actual user data
  const dynamicInsights = useMemo(() => {
    const insights: DynamicInsight[] = [];

    if (!summary || !transactions || transactions.length === 0) return insights;

    // 1. Savings Rate Analysis
    const savingsRate = summary.income > 0 ? (summary.savings / summary.income) * 100 : 0;
    
    if (savingsRate < 0) {
      insights.push({
        id: "negative-savings",
        type: "warning",
        message: `You're spending more than you earn! Your expenses exceed income by ${formatCurrency(Math.abs(summary.savings))}. Review your spending immediately.`,
        actionable: true,
        icon: AlertTriangle,
      });
    } else if (savingsRate < 10) {
      insights.push({
        id: "low-savings",
        type: "warning",
        message: `Your savings rate is only ${savingsRate.toFixed(1)}% (${formatCurrency(summary.savings)}). Experts recommend saving at least 20% of income.`,
        actionable: true,
        icon: PiggyBank,
      });
    } else if (savingsRate >= 20 && savingsRate < 30) {
      insights.push({
        id: "good-savings",
        type: "success",
        message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income (${formatCurrency(summary.savings)}). Keep up the good work!`,
        icon: CheckCircle,
      });
    } else if (savingsRate >= 30) {
      insights.push({
        id: "excellent-savings",
        type: "success",
        message: `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income. Consider investing ${formatCurrency(summary.savings * 0.7)} for better returns.`,
        icon: TrendingUp,
      });
    }

    // 2. Category-specific insights (based on actual breakdown)
    if (categoryBreakdown && categoryBreakdown.length > 0) {
      const sortedCategories = [...categoryBreakdown]
        .filter(c => c.name !== "Income")
        .sort((a, b) => b.value - a.value);

      // Dominant category warning
      if (sortedCategories.length > 0) {
        const topCategory = sortedCategories[0];
        const categoryPercentage = (topCategory.value / summary.totalSpend) * 100;
        
        if (categoryPercentage > 40) {
          insights.push({
            id: "dominant-category",
            type: "warning",
            message: `${topCategory.name} accounts for ${categoryPercentage.toFixed(0)}% of your spending (${formatCurrency(topCategory.value)}). This seems disproportionately high.`,
            actionable: true,
            savings: topCategory.value * 0.2, // Suggest 20% reduction
            icon: topCategory.name === "Food" ? Utensils : topCategory.name === "Shopping" ? ShoppingBag : Zap,
          });
        }
      }

      // Food spending analysis
      const foodSpend = sortedCategories.find(c => c.name === "Food");
      if (foodSpend) {
        const dailyFoodSpend = foodSpend.value / 30;
        if (dailyFoodSpend > 500) {
          insights.push({
            id: "high-food-spend",
            type: "suggestion",
            message: `You're spending ~${formatCurrency(dailyFoodSpend)}/day on food (${formatCurrency(foodSpend.value)}/month). Consider meal prep to save up to 40%.`,
            actionable: true,
            savings: foodSpend.value * 0.3,
            icon: Utensils,
          });
        }
      }

      // Shopping analysis
      const shoppingSpend = sortedCategories.find(c => c.name === "Shopping");
      if (shoppingSpend && summary.income > 0) {
        const shoppingPercentage = (shoppingSpend.value / summary.income) * 100;
        if (shoppingPercentage > 15) {
          insights.push({
            id: "high-shopping",
            type: "warning",
            message: `Shopping takes ${shoppingPercentage.toFixed(0)}% of your income (${formatCurrency(shoppingSpend.value)}). Try implementing a 48-hour rule before purchases.`,
            actionable: true,
            savings: shoppingSpend.value * 0.3,
            icon: ShoppingBag,
          });
        }
      }
    }

    // 3. Subscription analysis
    if (subscriptions && subscriptions.length > 0) {
      const activeSubscriptions = subscriptions.filter(s => s.isActive);
      const subscriptionTotal = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);
      
      if (activeSubscriptions.length > 3) {
        insights.push({
          id: "many-subscriptions",
          type: "suggestion",
          message: `You have ${activeSubscriptions.length} active subscriptions costing ${formatCurrency(subscriptionTotal)}/month. Review each to ensure you're getting value.`,
          actionable: true,
          icon: CreditCard,
        });
      }

      // Group by category
      const subsByCategory: Record<string, number> = {};
      for (const sub of activeSubscriptions) {
        subsByCategory[sub.category] = (subsByCategory[sub.category] || 0) + 1;
      }

      for (const [category, count] of Object.entries(subsByCategory)) {
        if (count > 1) {
          const catSubs = activeSubscriptions.filter(s => s.category === category);
          const catTotal = catSubs.reduce((sum, s) => sum + s.amount, 0);
          const minSub = Math.min(...catSubs.map(s => s.amount));
          
          insights.push({
            id: `duplicate-subs-${category}`,
            type: "warning",
            message: `You have ${count} ${category} subscriptions (${catSubs.map(s => s.name).join(", ")}) totaling ${formatCurrency(catTotal)}/month. Keep your favorite and cancel the rest!`,
            actionable: true,
            savings: catTotal - minSub,
            icon: CreditCard,
          });
        }
      }

      // Low usage subscriptions
      const lowUsageSubs = activeSubscriptions.filter(s => s.lowUsage);
      if (lowUsageSubs.length > 0) {
        const lowUsageTotal = lowUsageSubs.reduce((sum, s) => sum + s.amount, 0);
        insights.push({
          id: "low-usage-subs",
          type: "warning",
          message: `${lowUsageSubs.length} subscription(s) have low usage: ${lowUsageSubs.map(s => s.name).join(", ")}. Cancel to save ${formatCurrency(lowUsageTotal)}/month.`,
          actionable: true,
          savings: lowUsageTotal,
          icon: TrendingDown,
        });
      }
    }

    // 4. Transaction pattern insights
    if (transactions.length > 0) {
      // Count transactions by category
      const txnByCat: Record<string, number> = {};
      for (const txn of transactions) {
        if (txn.type === "debit") {
          txnByCat[txn.category || "Others"] = (txnByCat[txn.category || "Others"] || 0) + 1;
        }
      }

      // Frequent small transactions
      const smallTxns = transactions.filter(t => t.type === "debit" && t.amount < 200);
      if (smallTxns.length > 20) {
        const smallTotal = smallTxns.reduce((sum, t) => sum + t.amount, 0);
        insights.push({
          id: "frequent-small-txns",
          type: "info",
          message: `You made ${smallTxns.length} small transactions under ₹200, totaling ${formatCurrency(smallTotal)}. Small spends add up quickly!`,
          icon: Info,
        });
      }

      // Credit-to-debit ratio
      const creditCount = transactions.filter(t => t.type === "credit").length;
      const debitCount = transactions.filter(t => t.type === "debit").length;
      
      if (debitCount > creditCount * 10) {
        insights.push({
          id: "high-debit-ratio",
          type: "info",
          message: `You have ${debitCount} expense transactions vs ${creditCount} income entries. Consider tracking all income sources for accurate analysis.`,
          icon: Info,
        });
      }
    }

    // 5. Investment suggestion based on optimized savings
    if (summary.optimizedSavings > 5000) {
      insights.push({
        id: "invest-suggestion",
        type: "success",
        message: `With optimized savings of ${formatCurrency(summary.optimizedSavings)}/month, you could invest ${formatCurrency(summary.optimizedSavings * 0.7)} in SIPs and build ${formatCurrency(summary.optimizedSavings * 0.7 * 12 * 5 * 1.12)} in 5 years (12% returns).`,
        icon: TrendingUp,
      });
    }

    // 6. Yearly projection
    if (summary.yearlySavingsProjection > 0) {
      insights.push({
        id: "yearly-projection",
        type: "success",
        message: `At current rate, you'll save ${formatCurrency(summary.yearlySavingsProjection)}/year. That's enough for a great vacation or emergency fund!`,
        icon: PiggyBank,
      });
    }

    return insights;
  }, [transactions, subscriptions, categoryBreakdown, summary]);

  if (dynamicInsights.length === 0) return null;

  // Separate actionable and informational insights
  const actionableInsights = dynamicInsights.filter((i) => i.actionable);
  const informationalInsights = dynamicInsights.filter((i) => !i.actionable);

  const totalPotentialSavings = actionableInsights.reduce(
    (sum, i) => sum + (i.savings || 0),
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
              <Lightbulb className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <CardTitle>Smart Insights</CardTitle>
              <CardDescription>
                Personalized analysis based on your transactions
              </CardDescription>
            </div>
          </div>
          {totalPotentialSavings > 0 && (
            <div className="rounded-lg bg-chart-1/10 px-3 py-1.5">
              <p className="text-xs text-muted-foreground">Potential Savings</p>
              <p className="text-lg font-bold text-chart-1">
                {formatCurrency(totalPotentialSavings)}
                <span className="text-xs font-normal">/mo</span>
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Actionable insights first */}
        {actionableInsights.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ArrowRight className="h-4 w-4 text-primary" />
              Take Action
            </h4>
            <div className="space-y-2">
              {actionableInsights.map((insight) => {
                const Icon = insight.icon || insightIcons[insight.type];
                const colors = insightColors[insight.type];
                return (
                  <div
                    key={insight.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 ${colors.bg} ${colors.border}`}
                  >
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${colors.icon}`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{insight.message}</p>
                      {insight.savings && insight.savings > 0 && (
                        <p className={`mt-1 text-xs font-medium ${colors.text}`}>
                          Save {formatCurrency(insight.savings)}/month
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Informational insights */}
        {informationalInsights.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Info className="h-4 w-4 text-muted-foreground" />
              Insights
            </h4>
            <div className="space-y-2">
              {informationalInsights.map((insight) => {
                const Icon = insight.icon || insightIcons[insight.type];
                const colors = insightColors[insight.type];
                return (
                  <div
                    key={insight.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${colors.bg} ${colors.border}`}
                  >
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${colors.icon}`} />
                    <p className="text-sm text-foreground">{insight.message}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
