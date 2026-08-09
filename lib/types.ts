export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  category?: string;
  userId?: string;
  type: "credit" | "debit";
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  isActive: boolean;
  lowUsage?: boolean;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  fill: string;
}

export interface Insight {
  id: string;
  type: "info" | "warning" | "success" | "suggestion";
  message: string;
  actionable?: boolean;
  savings?: number;
}

export interface FinancialSummary {
  income: number;
  totalSpend: number;
  totalCredits: number;
  totalDebits: number;
  savings: number;
  subscriptionSpend: number;
  potentialSavings: number;
  optimizedSavings: number;
  yearlySavingsProjection: number;
}

export interface InvestmentSuggestion {
  level: "low" | "medium" | "high";
  suggestion: string;
  investAmount: number;
  bufferAmount: number;
}

export interface UsageData {
  appName: string;
  hoursPerMonth: number;
  cost: number;
}

// Demo data types
export interface DemoTransaction {
  date: string;
  name: string;
  amount: number;
  type?: "credit" | "debit";
}
