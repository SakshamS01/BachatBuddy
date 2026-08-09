"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/finance-utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Distinct, visually different colors for expense categories
const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#8B5CF6", // Purple
  Food: "#F97316", // Orange
  Travel: "#06B6D4", // Cyan
  Shopping: "#EC4899", // Pink
  Utilities: "#EAB308", // Yellow
  Health: "#22C55E", // Green
  Education: "#3B82F6", // Blue
  Others: "#6B7280", // Gray
  Income: "#10B981", // Emerald
};

// Fallback colors for unknown categories
const FALLBACK_COLORS = [
  "#8B5CF6", "#F97316", "#06B6D4", "#EC4899", 
  "#EAB308", "#22C55E", "#3B82F6", "#EF4444",
  "#14B8A6", "#A855F7", "#F59E0B", "#6366F1"
];

const getCategoryColor = (category: string, index: number): string => {
  return CATEGORY_COLORS[category] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
      fill: string;
      percentage: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: data.fill }}
          />
          <p className="font-medium text-card-foreground">{data.name}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(data.value)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {data.percentage.toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

interface LegendPayloadItem {
  value: string;
  color: string;
  payload: {
    name: string;
    value: number;
    percentage: number;
  };
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

const CustomLegend = ({ payload }: CustomLegendProps) => {
  if (!payload) return null;
  
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export function ExpenseChart() {
  const { categoryBreakdown, summary, transactions } = useFinance();

  if (!categoryBreakdown || categoryBreakdown.length === 0) return null;

  // Filter out credits (Income category) for expense breakdown
  const expenseBreakdown = categoryBreakdown.filter(
    (item) => item.name !== "Income"
  );

  const totalExpenses = expenseBreakdown.reduce((sum, item) => sum + item.value, 0);

  const chartData = expenseBreakdown.map((item, index) => ({
    name: item.name,
    value: item.value,
    fill: getCategoryColor(item.name, index),
    percentage: totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0,
  }));

  // Sort by value descending for the list
  const sortedData = [...chartData].sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>
          Where your money goes each month (debits only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category breakdown list with distinct colors */}
        <div className="mt-6 space-y-3">
          {sortedData.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-4 w-4 rounded-full shadow-sm"
                  style={{ backgroundColor: category.fill }}
                />
                <span className="text-sm font-medium text-foreground">
                  {category.name}
                </span>
              </div>
              <div className="text-right flex items-center gap-3">
                <span 
                  className="text-sm font-bold"
                  style={{ color: category.fill }}
                >
                  {formatCurrency(category.value)}
                </span>
                <span className="text-xs text-muted-foreground min-w-[50px] text-right">
                  ({category.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Total Expenses</span>
          <span className="text-lg font-bold text-destructive">
            {formatCurrency(totalExpenses)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
