"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type {
  Transaction,
  Subscription,
  CategoryBreakdown,
  Insight,
  FinancialSummary,
  InvestmentSuggestion,
  UsageData,
} from "@/lib/types";
import {
  categorizeTransaction,
  detectSubscriptions,
  calculateCategoryBreakdown,
  calculateFinancialSummary,
  generateInsights,
  getInvestmentSuggestion,
  analyzeUsage,
  parseCSV,
  parseJSON,
} from "@/lib/finance-utils";
import {
  demoTransactions,
  demoUsageData,
  defaultMonthlyIncome,
} from "@/lib/demo-data";

interface FinanceContextType {
  // Data
  transactions: Transaction[];
  subscriptions: Subscription[];
  categoryBreakdown: CategoryBreakdown[];
  insights: Insight[];
  summary: FinancialSummary | null;
  investmentSuggestion: InvestmentSuggestion | null;
  usageData: UsageData[];

  // State
  monthlyIncome: number;
  isAnalyzing: boolean;
  hasData: boolean;

  // Actions
  setMonthlyIncome: (income: number) => void;
  loadDemoData: () => void;
  loadTransactions: (transactions: Transaction[]) => void;
  parseAndLoadFile: (content: string, fileType: "csv" | "json") => void;
  addManualExpense: (expense: Omit<Transaction, "id" | "category">) => void;
  setUsageData: (data: UsageData[]) => void;
  cancelSubscription: (subscriptionId: string) => void;
  resetData: () => void;
  analyzeData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [investmentSuggestion, setInvestmentSuggestion] =
    useState<InvestmentSuggestion | null>(null);
  const [usageData, setUsageDataState] = useState<UsageData[]>([]);
  const [monthlyIncome, setMonthlyIncomeState] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasData, setHasData] = useState(false);

  const analyzeData = useCallback(() => {
    if (transactions.length === 0 || monthlyIncome <= 0) return;

    setIsAnalyzing(true);

    // Simulate analysis time for better UX
    setTimeout(() => {
      // Detect subscriptions
      let detectedSubs = detectSubscriptions(transactions);

      // Apply usage analysis if available
      if (usageData.length > 0) {
        detectedSubs = analyzeUsage(usageData, detectedSubs);
      }

      // Calculate category breakdown
      const breakdown = calculateCategoryBreakdown(transactions);

      // Calculate financial summary
      const financialSummary = calculateFinancialSummary(
        monthlyIncome,
        transactions,
        detectedSubs
      );

      // Generate insights
      const generatedInsights = generateInsights(
        financialSummary,
        detectedSubs,
        breakdown
      );

      // Get investment suggestion
      const suggestion = getInvestmentSuggestion(financialSummary.optimizedSavings);

      // Update state
      setSubscriptions(detectedSubs);
      setCategoryBreakdown(breakdown);
      setSummary(financialSummary);
      setInsights(generatedInsights);
      setInvestmentSuggestion(suggestion);
      setHasData(true);
      setIsAnalyzing(false);
    }, 1500);
  }, [transactions, monthlyIncome, usageData]);

  const setMonthlyIncome = useCallback((income: number) => {
    setMonthlyIncomeState(income);
  }, []);

  const loadDemoData = useCallback(() => {
    setTransactions(demoTransactions);
    setUsageDataState(demoUsageData);
    setMonthlyIncomeState(defaultMonthlyIncome);
  }, []);

  const loadTransactions = useCallback((newTransactions: Transaction[]) => {
    // Categorize transactions if not already categorized
    const categorizedTransactions = newTransactions.map((t) => ({
      ...t,
      category: t.category || categorizeTransaction(t.name),
    }));
    setTransactions(categorizedTransactions);
  }, []);

  const parseAndLoadFile = useCallback(
    (content: string, fileType: "csv" | "json") => {
      const parsedTransactions =
        fileType === "csv" ? parseCSV(content) : parseJSON(content);
      loadTransactions(parsedTransactions);
    },
    [loadTransactions]
  );

  const addManualExpense = useCallback(
    (expense: Omit<Transaction, "id" | "category">) => {
      const newTransaction: Transaction = {
        ...expense,
        id: `manual-${Date.now()}`,
        category: categorizeTransaction(expense.name),
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    },
    []
  );

  const setUsageData = useCallback((data: UsageData[]) => {
    setUsageDataState(data);
  }, []);

  const cancelSubscription = useCallback((subscriptionId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === subscriptionId ? { ...sub, isActive: false } : sub
      )
    );
  }, []);

  const resetData = useCallback(() => {
    setTransactions([]);
    setSubscriptions([]);
    setCategoryBreakdown([]);
    setInsights([]);
    setSummary(null);
    setInvestmentSuggestion(null);
    setUsageDataState([]);
    setMonthlyIncomeState(0);
    setHasData(false);
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        subscriptions,
        categoryBreakdown,
        insights,
        summary,
        investmentSuggestion,
        usageData,
        monthlyIncome,
        isAnalyzing,
        hasData,
        setMonthlyIncome,
        loadDemoData,
        loadTransactions,
        parseAndLoadFile,
        addManualExpense,
        setUsageData,
        cancelSubscription,
        resetData,
        analyzeData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
