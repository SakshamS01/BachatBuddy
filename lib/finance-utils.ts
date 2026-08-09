// import type {
//   Transaction,
//   Subscription,
//   CategoryBreakdown,
//   Insight,
//   FinancialSummary,
//   InvestmentSuggestion,
//   UsageData,
// } from "./types";

// // Category mapping based on keywords
// const categoryKeywords: Record<string, string[]> = {
//   Entertainment: ["netflix", "spotify", "hotstar", "prime", "youtube", "disney", "apple music", "zee5", "sonyliv", "jiocinema"],
//   Food: ["zomato", "swiggy", "uber eats", "dominos", "pizza", "restaurant", "cafe", "mcdonalds", "kfc", "starbucks"],
//   Travel: ["uber", "ola", "rapido", "metro", "train", "flight", "bus", "petrol", "fuel", "parking"],
//   Shopping: ["amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "zepto", "blinkit", "instamart", "bigbasket"],
//   Utilities: ["electricity", "water", "gas", "internet", "wifi", "broadband", "jio", "airtel", "vi", "bsnl"],
//   Health: ["pharmacy", "hospital", "doctor", "gym", "cult", "apollo", "pharmeasy", "netmeds", "1mg"],
//   Education: ["udemy", "coursera", "skillshare", "unacademy", "byju", "book", "library"],
// };

// export const categorizeTransaction = (name: string): string => {
//   const lowerName = name.toLowerCase();
//   for (const [category, keywords] of Object.entries(categoryKeywords)) {
//     if (keywords.some((keyword) => lowerName.includes(keyword))) {
//       return category;
//     }
//   }
//   return "Others";
// };

// export const detectSubscriptions = (transactions: Transaction[]): Subscription[] => {
//   // Group transactions by name
//   const groupedByName: Record<string, Transaction[]> = {};

//   for (const transaction of transactions) {
//     const key = transaction.name.toLowerCase();
//     if (!groupedByName[key]) {
//       groupedByName[key] = [];
//     }
//     groupedByName[key].push(transaction);
//   }

//   const subscriptions: Subscription[] = [];

//   for (const [name, txns] of Object.entries(groupedByName)) {
//     if (txns.length < 2) continue;

//     // Sort by date
//     const sortedTxns = txns.sort(
//       (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//     );

//     // Check if amounts are same/similar
//     const amounts = sortedTxns.map((t) => t.amount);
//     const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
//     const amountsConsistent = amounts.every(
//       (amt) => Math.abs(amt - avgAmount) < avgAmount * 0.1
//     );

//     if (!amountsConsistent) continue;

//     // Check if dates are 25-35 days apart
//     let isRecurring = true;
//     for (let i = 1; i < sortedTxns.length; i++) {
//       const daysDiff = Math.abs(
//         (new Date(sortedTxns[i].date).getTime() -
//           new Date(sortedTxns[i - 1].date).getTime()) /
//           (1000 * 60 * 60 * 24)
//       );
//       if (daysDiff < 25 || daysDiff > 35) {
//         isRecurring = false;
//         break;
//       }
//     }

//     if (isRecurring) {
//       subscriptions.push({
//         id: `sub-${name.replace(/\s+/g, "-")}`,
//         name: txns[0].name,
//         amount: avgAmount,
//         category: categorizeTransaction(name),
//         frequency: "Monthly",
//         isActive: true,
//       });
//     }
//   }

//   return subscriptions;
// };

// export const calculateCategoryBreakdown = (
//   transactions: Transaction[]
// ): CategoryBreakdown[] => {
//   const categoryTotals: Record<string, number> = {};

//   for (const transaction of transactions) {
//     const category = transaction.category || categorizeTransaction(transaction.name);
//     categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
//   }

//   const colors = [
//     "var(--chart-1)",
//     "var(--chart-2)",
//     "var(--chart-3)",
//     "var(--chart-4)",
//     "var(--chart-5)",
//   ];

//   return Object.entries(categoryTotals).map(([name, value], index) => ({
//     name,
//     value,
//     fill: colors[index % colors.length],
//   }));
// };

// export const calculateFinancialSummary = (
//   income: number,
//   transactions: Transaction[],
//   subscriptions: Subscription[]
// ): FinancialSummary => {
//   // Separate credits and debits from transactions
//   const totalCredits = transactions
//     .filter((t) => t.type === "credit")
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   const totalDebits = transactions
//     .filter((t) => t.type === "debit")
//     .reduce((sum, t) => sum + t.amount, 0);
  
//   // Use totalDebits as totalSpend (expenses)
//   const totalSpend = totalDebits;
  
//   // Calculate effective income: manual income + credits from transactions
//   const effectiveIncome = income > 0 ? income : totalCredits;
  
//   // Savings = income - expenses (debits only)
//   const savings = effectiveIncome - totalSpend;
  
//   const subscriptionSpend = subscriptions
//     .filter((s) => s.isActive)
//     .reduce((sum, s) => sum + s.amount, 0);

//   // Calculate potential savings from low-usage or unnecessary subscriptions
//   const wasteSubscriptions = subscriptions.filter(
//     (s) => s.isActive && s.lowUsage
//   );
//   const potentialSavings = wasteSubscriptions.reduce((sum, s) => sum + s.amount, 0);

//   const optimizedSavings = savings + potentialSavings;
//   const yearlySavingsProjection = optimizedSavings * 12;

//   return {
//     income: effectiveIncome,
//     totalSpend,
//     totalCredits,
//     totalDebits,
//     savings,
//     subscriptionSpend,
//     potentialSavings,
//     optimizedSavings,
//     yearlySavingsProjection,
//   };
// };

// export const generateInsights = (
//   summary: FinancialSummary,
//   subscriptions: Subscription[],
//   categoryBreakdown: CategoryBreakdown[]
// ): Insight[] => {
//   const insights: Insight[] = [];

//   // Subscription insights
//   if (summary.subscriptionSpend > 0) {
//     insights.push({
//       id: "sub-spend",
//       type: "info",
//       message: `You spend ₹${summary.subscriptionSpend.toLocaleString("en-IN")} per month on subscriptions.`,
//     });
//   }

//   // Multiple subscriptions in same category
//   const subCategories: Record<string, Subscription[]> = {};
//   for (const sub of subscriptions) {
//     if (!subCategories[sub.category]) {
//       subCategories[sub.category] = [];
//     }
//     subCategories[sub.category].push(sub);
//   }

//   for (const [category, subs] of Object.entries(subCategories)) {
//     if (subs.length > 1) {
//       const totalCost = subs.reduce((sum, s) => sum + s.amount, 0);
//       insights.push({
//         id: `multi-sub-${category}`,
//         type: "warning",
//         message: `You have ${subs.length} subscriptions in ${category} costing ₹${totalCost.toLocaleString("en-IN")}/month. Consider keeping only one.`,
//         actionable: true,
//         savings: totalCost - Math.min(...subs.map((s) => s.amount)),
//       });
//     }
//   }

//   // Dominant spending category
//   const sortedCategories = [...categoryBreakdown].sort((a, b) => b.value - a.value);
//   if (sortedCategories.length > 0) {
//     const dominant = sortedCategories[0];
//     const percentage = ((dominant.value / summary.totalSpend) * 100).toFixed(1);
//     if (parseFloat(percentage) > 30) {
//       insights.push({
//         id: "dominant-category",
//         type: "warning",
//         message: `${dominant.name} dominates your spending at ${percentage}% (₹${dominant.value.toLocaleString("en-IN")}).`,
//       });
//     }
//   }

//   // Savings potential
//   if (summary.potentialSavings > 0) {
//     insights.push({
//       id: "potential-savings",
//       type: "success",
//       message: `Cancel unused subscriptions to save ₹${summary.potentialSavings.toLocaleString("en-IN")}/month.`,
//       actionable: true,
//       savings: summary.potentialSavings,
//     });
//   }

//   // Yearly projection
//   if (summary.yearlySavingsProjection > 0) {
//     insights.push({
//       id: "yearly-projection",
//       type: "success",
//       message: `You can save ₹${summary.yearlySavingsProjection.toLocaleString("en-IN")}/year with optimized spending!`,
//     });
//   }

//   // Low savings warning
//   if (summary.savings < summary.income * 0.1) {
//     insights.push({
//       id: "low-savings",
//       type: "warning",
//       message: `Your savings are less than 10% of income. Try to reduce discretionary spending.`,
//     });
//   }

//   return insights;
// };

// export const getInvestmentSuggestion = (savings: number): InvestmentSuggestion => {
//   if (savings < 2000) {
//     return {
//       level: "low",
//       suggestion: "Start with a Recurring Deposit (RD) or a small SIP of ₹500/month to build the habit.",
//       investAmount: Math.max(500, savings * 0.5),
//       bufferAmount: savings - Math.max(500, savings * 0.5),
//     };
//   } else if (savings <= 10000) {
//     const investAmount = savings * 0.7;
//     return {
//       level: "medium",
//       suggestion: "Consider starting a Mutual Fund SIP. Diversify between equity and debt funds.",
//       investAmount,
//       bufferAmount: savings - investAmount,
//     };
//   } else {
//     const investAmount = savings * 0.7;
//     return {
//       level: "high",
//       suggestion: "Diversify your investments: SIPs, stocks, and consider NPS for tax benefits.",
//       investAmount,
//       bufferAmount: savings - investAmount,
//     };
//   }
// };

// export const analyzeUsage = (
//   usageData: UsageData[],
//   subscriptions: Subscription[]
// ): Subscription[] => {
//   return subscriptions.map((sub) => {
//     const usage = usageData.find(
//       (u) => u.appName.toLowerCase() === sub.name.toLowerCase()
//     );
//     if (usage) {
//       // Less than 5 hours per month = low usage
//       const lowUsage = usage.hoursPerMonth < 5;
//       return { ...sub, lowUsage };
//     }
//     return sub;
//   });
// };

// export const formatCurrency = (amount: number): string => {
//   return `₹${amount.toLocaleString("en-IN")}`;
// };

// export const parseCSV = (csvContent: string): Transaction[] => {
//   const lines = csvContent.trim().split("\n");
//   const headers = lines[0].toLowerCase().split(",").map(h => h.trim());

//   const dateIndex = headers.findIndex((h) => h.includes("date"));
//   const nameIndex = headers.findIndex(
//     (h) => h.includes("name") || h.includes("description") || h.includes("merchant") || h.includes("narration") || h.includes("particulars")
//   );
//   const amountIndex = headers.findIndex((h) => h.includes("amount") && !h.includes("credit") && !h.includes("debit"));
  
//   // Check for separate credit/debit columns (common in bank statements)
//   const creditIndex = headers.findIndex((h) => h.includes("credit") || h.includes("deposit") || h.includes("cr"));
//   const debitIndex = headers.findIndex((h) => h.includes("debit") || h.includes("withdrawal") || h.includes("dr"));
  
//   // Check for type column
//   const typeIndex = headers.findIndex((h) => h.includes("type") || h.includes("transaction type") || h.includes("txn type"));

//   // Validate required columns
//   const hasAmountColumn = amountIndex !== -1;
//   const hasSeparateCreditDebit = creditIndex !== -1 || debitIndex !== -1;
  
//   if (dateIndex === -1 || nameIndex === -1 || (!hasAmountColumn && !hasSeparateCreditDebit)) {
//     throw new Error("Invalid CSV format. Required columns: date, name/description/narration, and either amount OR credit/debit columns");
//   }

//   const transactions: Transaction[] = [];

//   for (let i = 1; i < lines.length; i++) {
//     const line = lines[i].trim();
//     if (!line) continue;

//     // Handle CSV values that may contain commas within quotes
//     const values = parseCSVLine(line);
    
//     const name = values[nameIndex]?.trim() || "";
//     const date = values[dateIndex]?.trim() || "";
    
//     if (!name || !date) continue;

//     let amount = 0;
//     let type: "credit" | "debit" = "debit";

//     if (hasSeparateCreditDebit) {
//       // Separate credit/debit columns
//       const creditValue = creditIndex !== -1 ? parseFloat(values[creditIndex]?.trim().replace(/[^0-9.-]/g, "") || "0") : 0;
//       const debitValue = debitIndex !== -1 ? parseFloat(values[debitIndex]?.trim().replace(/[^0-9.-]/g, "") || "0") : 0;
      
//       if (creditValue > 0) {
//         amount = creditValue;
//         type = "credit";
//       } else if (debitValue > 0) {
//         amount = debitValue;
//         type = "debit";
//       } else {
//         // Skip empty transactions
//         continue;
//       }
//     } else if (hasAmountColumn) {
//       // Single amount column - detect type from sign, prefix, or type column
//       let rawAmount = values[amountIndex]?.trim() || "0";
      
//       // Check for CR/DR suffix or prefix
//       const hasCRIndicator = rawAmount.toLowerCase().includes("cr") || rawAmount.includes("+");
//       const hasDRIndicator = rawAmount.toLowerCase().includes("dr") || rawAmount.includes("-");
      
//       // Remove non-numeric characters except decimal and minus
//       rawAmount = rawAmount.replace(/[^0-9.-]/g, "");
//       const numericAmount = parseFloat(rawAmount) || 0;
      
//       // Determine type
//       if (typeIndex !== -1) {
//         const typeValue = values[typeIndex]?.trim().toLowerCase() || "";
//         type = (typeValue.includes("credit") || typeValue.includes("cr") || typeValue.includes("deposit") || typeValue.includes("income") || typeValue.includes("refund")) 
//           ? "credit" 
//           : "debit";
//       } else if (hasCRIndicator) {
//         type = "credit";
//       } else if (hasDRIndicator) {
//         type = "debit";
//       } else if (numericAmount < 0) {
//         // Negative amounts are debits in most bank statements
//         type = "debit";
//       } else {
//         // Positive amounts without indicators - check name for hints
//         const lowerName = name.toLowerCase();
//         const isLikelyCredit = lowerName.includes("salary") || lowerName.includes("refund") || 
//           lowerName.includes("cashback") || lowerName.includes("interest") || 
//           lowerName.includes("dividend") || lowerName.includes("received") ||
//           lowerName.includes("credit") || lowerName.includes("deposit") ||
//           lowerName.includes("transfer from") || lowerName.includes("incoming");
//         type = isLikelyCredit ? "credit" : "debit";
//       }
      
//       amount = Math.abs(numericAmount);
//     }

//     transactions.push({
//       id: `csv-${i}`,
//       date,
//       name,
//       amount,
//       type,
//       category: categorizeTransaction(name),
//     });
//   }

//   return transactions;
// };

// // Helper function to parse CSV line handling quoted values
// const parseCSVLine = (line: string): string[] => {
//   const values: string[] = [];
//   let current = "";
//   let inQuotes = false;
  
//   for (let i = 0; i < line.length; i++) {
//     const char = line[i];
    
//     if (char === '"') {
//       inQuotes = !inQuotes;
//     } else if (char === ',' && !inQuotes) {
//       values.push(current);
//       current = "";
//     } else {
//       current += char;
//     }
//   }
//   values.push(current);
  
//   return values;
// };

// export const parseJSON = (jsonContent: string): Transaction[] => {
//   const data = JSON.parse(jsonContent);
//   const transactions = Array.isArray(data) ? data : data.transactions || [];

//   return transactions.map((t: { 
//     date?: string; 
//     name?: string; 
//     description?: string; 
//     merchant?: string; 
//     amount?: number;
//     credit?: number;
//     debit?: number;
//     type?: string;
//   }, index: number) => {
//     const name = t.name || t.description || t.merchant || "";
//     let amount = 0;
//     let type: "credit" | "debit" = "debit";

//     // Check for separate credit/debit fields
//     if (t.credit !== undefined && t.credit > 0) {
//       amount = t.credit;
//       type = "credit";
//     } else if (t.debit !== undefined && t.debit > 0) {
//       amount = t.debit;
//       type = "debit";
//     } else if (t.amount !== undefined) {
//       // Single amount field - check type or sign
//       if (t.type) {
//         const typeValue = t.type.toLowerCase();
//         type = (typeValue.includes("credit") || typeValue.includes("cr") || typeValue.includes("deposit") || typeValue.includes("income")) 
//           ? "credit" 
//           : "debit";
//       } else if (t.amount < 0) {
//         type = "debit";
//       } else {
//         // Check name for hints
//         const lowerName = name.toLowerCase();
//         const isLikelyCredit = lowerName.includes("salary") || lowerName.includes("refund") || 
//           lowerName.includes("cashback") || lowerName.includes("interest") || 
//           lowerName.includes("dividend") || lowerName.includes("received") ||
//           lowerName.includes("credit") || lowerName.includes("deposit");
//         type = isLikelyCredit ? "credit" : "debit";
//       }
//       amount = Math.abs(t.amount);
//     }

//     return {
//       id: `json-${index}`,
//       date: t.date || "",
//       name,
//       amount,
//       type,
//       category: categorizeTransaction(name),
//     };
//   });
// };


import type {
  Transaction,
  Subscription,
  CategoryBreakdown,
  Insight,
  FinancialSummary,
  InvestmentSuggestion,
  UsageData,
} from "./types";

// Category mapping based on keywords
const categoryKeywords: Record<string, string[]> = {
  Entertainment: ["netflix", "spotify", "hotstar", "prime", "youtube", "disney", "apple music", "zee5", "sonyliv", "jiocinema"],
  Food: ["zomato", "swiggy", "uber eats", "dominos", "pizza", "restaurant", "cafe", "mcdonalds", "kfc", "starbucks"],
  Travel: ["uber", "ola", "rapido", "metro", "train", "flight", "bus", "petrol", "fuel", "parking"],
  Shopping: ["amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "zepto", "blinkit", "instamart", "bigbasket"],
  Utilities: ["electricity", "water", "gas", "internet", "wifi", "broadband", "jio", "airtel", "vi", "bsnl"],
  Health: ["pharmacy", "hospital", "doctor", "gym", "cult", "apollo", "pharmeasy", "netmeds", "1mg"],
  Education: ["udemy", "coursera", "skillshare", "unacademy", "byju", "book", "library"],
};

export const categorizeTransaction = (name: string): string => {
  const lowerName = name.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerName.includes(keyword))) {
      return category;
    }
  }
  return "Others";
};

export const detectSubscriptions = (transactions: Transaction[]): Subscription[] => {
  // Group transactions by name
  const groupedByName: Record<string, Transaction[]> = {};

  for (const transaction of transactions) {
    const key = transaction.name.toLowerCase();
    if (!groupedByName[key]) {
      groupedByName[key] = [];
    }
    groupedByName[key].push(transaction);
  }

  const subscriptions: Subscription[] = [];

  for (const [name, txns] of Object.entries(groupedByName)) {
    if (txns.length < 2) continue;

    // Sort by date
    const sortedTxns = txns.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Check if amounts are same/similar
    const amounts = sortedTxns.map((t) => t.amount);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const amountsConsistent = amounts.every(
      (amt) => Math.abs(amt - avgAmount) < avgAmount * 0.1
    );

    if (!amountsConsistent) continue;

    // Check if dates are 25-35 days apart
    let isRecurring = true;
    for (let i = 1; i < sortedTxns.length; i++) {
      const daysDiff = Math.abs(
        (new Date(sortedTxns[i].date).getTime() -
          new Date(sortedTxns[i - 1].date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysDiff < 25 || daysDiff > 35) {
        isRecurring = false;
        break;
      }
    }

    if (isRecurring) {
      subscriptions.push({
        id: `sub-${name.replace(/\s+/g, "-")}`,
        name: txns[0].name,
        amount: avgAmount,
        category: categorizeTransaction(name),
        frequency: "Monthly",
        isActive: true,
      });
    }
  }

  return subscriptions;
};

export const calculateCategoryBreakdown = (
  transactions: Transaction[]
): CategoryBreakdown[] => {
  const categoryTotals: Record<string, number> = {};

  for (const transaction of transactions) {
    const category = transaction.category || categorizeTransaction(transaction.name);
    categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
  }

  const colors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];

  return Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    value,
    fill: colors[index % colors.length],
  }));
};

export const calculateFinancialSummary = (
  income: number,
  transactions: Transaction[],
  subscriptions: Subscription[]
): FinancialSummary => {
  // Separate credits and debits from transactions
  const totalCredits = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Use totalDebits as totalSpend (expenses)
  const totalSpend = totalDebits;
  
  // Calculate effective income: manual income + credits from transactions
  const effectiveIncome = income > 0 ? income : totalCredits;
  
  // Savings = income - expenses (debits only)
  const savings = effectiveIncome - totalSpend;
  
  const subscriptionSpend = subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + s.amount, 0);

  // Calculate potential savings from low-usage or unnecessary subscriptions
  const wasteSubscriptions = subscriptions.filter(
    (s) => s.isActive && s.lowUsage
  );
  const potentialSavings = wasteSubscriptions.reduce((sum, s) => sum + s.amount, 0);

  const optimizedSavings = savings + potentialSavings;
  const yearlySavingsProjection = optimizedSavings * 12;

  return {
    income: effectiveIncome,
    totalSpend,
    totalCredits,
    totalDebits,
    savings,
    subscriptionSpend,
    potentialSavings,
    optimizedSavings,
    yearlySavingsProjection,
  };
};

export const generateInsights = (
  summary: FinancialSummary,
  subscriptions: Subscription[],
  categoryBreakdown: CategoryBreakdown[]
): Insight[] => {
  const insights: Insight[] = [];

  // Subscription insights
  if (summary.subscriptionSpend > 0) {
    insights.push({
      id: "sub-spend",
      type: "info",
      message: `You spend ₹${summary.subscriptionSpend.toLocaleString("en-IN")} per month on subscriptions.`,
    });
  }

  // Multiple subscriptions in same category
  const subCategories: Record<string, Subscription[]> = {};
  for (const sub of subscriptions) {
    if (!subCategories[sub.category]) {
      subCategories[sub.category] = [];
    }
    subCategories[sub.category].push(sub);
  }

  for (const [category, subs] of Object.entries(subCategories)) {
    if (subs.length > 1) {
      const totalCost = subs.reduce((sum, s) => sum + s.amount, 0);
      insights.push({
        id: `multi-sub-${category}`,
        type: "warning",
        message: `You have ${subs.length} subscriptions in ${category} costing ₹${totalCost.toLocaleString("en-IN")}/month. Consider keeping only one.`,
        actionable: true,
        savings: totalCost - Math.min(...subs.map((s) => s.amount)),
      });
    }
  }

  // Dominant spending category
  const sortedCategories = [...categoryBreakdown].sort((a, b) => b.value - a.value);
  if (sortedCategories.length > 0) {
    const dominant = sortedCategories[0];
    const percentage = ((dominant.value / summary.totalSpend) * 100).toFixed(1);
    if (parseFloat(percentage) > 30) {
      insights.push({
        id: "dominant-category",
        type: "warning",
        message: `${dominant.name} dominates your spending at ${percentage}% (₹${dominant.value.toLocaleString("en-IN")}).`,
      });
    }
  }

  // Savings potential
  if (summary.potentialSavings > 0) {
    insights.push({
      id: "potential-savings",
      type: "success",
      message: `Cancel unused subscriptions to save ₹${summary.potentialSavings.toLocaleString("en-IN")}/month.`,
      actionable: true,
      savings: summary.potentialSavings,
    });
  }

  // Yearly projection
  if (summary.yearlySavingsProjection > 0) {
    insights.push({
      id: "yearly-projection",
      type: "success",
      message: `You can save ₹${summary.yearlySavingsProjection.toLocaleString("en-IN")}/year with optimized spending!`,
    });
  }

  // Low savings warning
  if (summary.savings < summary.income * 0.1) {
    insights.push({
      id: "low-savings",
      type: "warning",
      message: `Your savings are less than 10% of income. Try to reduce discretionary spending.`,
    });
  }

  return insights;
};

export const getInvestmentSuggestion = (savings: number): InvestmentSuggestion => {
  if (savings < 2000) {
    return {
      level: "low",
      suggestion: "Start with a Recurring Deposit (RD) or a small SIP of ₹500/month to build the habit.",
      investAmount: Math.max(500, savings * 0.5),
      bufferAmount: savings - Math.max(500, savings * 0.5),
    };
  } else if (savings <= 10000) {
    const investAmount = savings * 0.7;
    return {
      level: "medium",
      suggestion: "Consider starting a Mutual Fund SIP. Diversify between equity and debt funds.",
      investAmount,
      bufferAmount: savings - investAmount,
    };
  } else {
    const investAmount = savings * 0.7;
    return {
      level: "high",
      suggestion: "Diversify your investments: SIPs, stocks, and consider NPS for tax benefits.",
      investAmount,
      bufferAmount: savings - investAmount,
    };
  }
};

export const analyzeUsage = (
  usageData: UsageData[],
  subscriptions: Subscription[]
): Subscription[] => {
  return subscriptions.map((sub) => {
    const usage = usageData.find(
      (u) => u.appName.toLowerCase() === sub.name.toLowerCase()
    );
    if (usage) {
      // Less than 5 hours per month = low usage
      const lowUsage = usage.hoursPerMonth < 5;
      return { ...sub, lowUsage };
    }
    return sub;
  });
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const parseCSV = (csvContent: string): Transaction[] => {
  const lines = csvContent.trim().split("\n");
  const headers = lines[0].toLowerCase().split(",").map(h => h.trim());

  const dateIndex = headers.findIndex((h) => h.includes("date"));
  const nameIndex = headers.findIndex(
    (h) => h.includes("name") || h.includes("desc") || h.includes("merchant") || h.includes("narration") || h.includes("particulars")
  );
  const amountIndex = headers.findIndex((h) => h.includes("amount") && !h.includes("credit") && !h.includes("debit"));
  
  // Check for separate credit/debit columns (common in bank statements).
  // "cr"/"dr" are matched as whole tokens (\b = word boundary) so they only catch
  // standalone abbreviations like "Cr" or "Amount (Dr)" — not letters that happen to
  // appear inside unrelated words like "description" (which contains "cr") or "credit" itself.
  const creditIndex = headers.findIndex((h) => h.includes("credit") || h.includes("deposit") || /\bcr\b/.test(h));
  const debitIndex = headers.findIndex((h) => h.includes("debit") || h.includes("withdrawal") || /\bdr\b/.test(h));
  
  // Check for type column
  const typeIndex = headers.findIndex((h) => h.includes("type") || h.includes("transaction type") || h.includes("txn type"));

  // Validate required columns
  const hasAmountColumn = amountIndex !== -1;
  const hasSeparateCreditDebit = creditIndex !== -1 || debitIndex !== -1;
  
  if (dateIndex === -1 || nameIndex === -1 || (!hasAmountColumn && !hasSeparateCreditDebit)) {
    throw new Error("Invalid CSV format. Required columns: date, name/description/narration, and either amount OR credit/debit columns");
  }

  const transactions: Transaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle CSV values that may contain commas within quotes
    const values = parseCSVLine(line);
    
    const name = values[nameIndex]?.trim() || "";
    const date = values[dateIndex]?.trim() || "";
    
    if (!name || !date) continue;

    let amount = 0;
    let type: "credit" | "debit" = "debit";

    if (hasSeparateCreditDebit) {
      // Separate credit/debit columns
      const creditValue = creditIndex !== -1 ? parseFloat(values[creditIndex]?.trim().replace(/[^0-9.-]/g, "") || "0") : 0;
      const debitValue = debitIndex !== -1 ? parseFloat(values[debitIndex]?.trim().replace(/[^0-9.-]/g, "") || "0") : 0;
      
      if (creditValue > 0) {
        amount = creditValue;
        type = "credit";
      } else if (debitValue > 0) {
        amount = debitValue;
        type = "debit";
      } else {
        // Skip empty transactions
        continue;
      }
    } else if (hasAmountColumn) {
      // Single amount column - detect type from sign, prefix, or type column
      let rawAmount = values[amountIndex]?.trim() || "0";
      
      // Check for CR/DR suffix or prefix
      const hasCRIndicator = rawAmount.toLowerCase().includes("cr") || rawAmount.includes("+");
      const hasDRIndicator = rawAmount.toLowerCase().includes("dr") || rawAmount.includes("-");
      
      // Remove non-numeric characters except decimal and minus
      rawAmount = rawAmount.replace(/[^0-9.-]/g, "");
      const numericAmount = parseFloat(rawAmount) || 0;
      
      // Determine type
      if (typeIndex !== -1) {
        const typeValue = values[typeIndex]?.trim().toLowerCase() || "";
        type = (typeValue.includes("credit") || typeValue.includes("cr") || typeValue.includes("deposit") || typeValue.includes("income") || typeValue.includes("refund")) 
          ? "credit" 
          : "debit";
      } else if (hasCRIndicator) {
        type = "credit";
      } else if (hasDRIndicator) {
        type = "debit";
      } else if (numericAmount < 0) {
        // Negative amounts are debits in most bank statements
        type = "debit";
      } else {
        // Positive amounts without indicators - check name for hints
        const lowerName = name.toLowerCase();
        const isLikelyCredit = lowerName.includes("salary") || lowerName.includes("refund") || 
          lowerName.includes("cashback") || lowerName.includes("interest") || 
          lowerName.includes("dividend") || lowerName.includes("received") ||
          lowerName.includes("credit") || lowerName.includes("deposit") ||
          lowerName.includes("transfer from") || lowerName.includes("incoming");
        type = isLikelyCredit ? "credit" : "debit";
      }
      
      amount = Math.abs(numericAmount);
    }

    transactions.push({
      id: `csv-${i}`,
      date,
      name,
      amount,
      type,
      category: categorizeTransaction(name),
    });
  }

  return transactions;
};

// Helper function to parse CSV line handling quoted values
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  
  return values;
};

export const parseJSON = (jsonContent: string): Transaction[] => {
  const data = JSON.parse(jsonContent);
  const transactions = Array.isArray(data) ? data : data.transactions || [];

  return transactions.map((t: { 
    date?: string; 
    name?: string; 
    description?: string; 
    merchant?: string; 
    amount?: number;
    credit?: number;
    debit?: number;
    type?: string;
  }, index: number) => {
    const name = t.name || t.description || t.merchant || "";
    let amount = 0;
    let type: "credit" | "debit" = "debit";

    // Check for separate credit/debit fields
    if (t.credit !== undefined && t.credit > 0) {
      amount = t.credit;
      type = "credit";
    } else if (t.debit !== undefined && t.debit > 0) {
      amount = t.debit;
      type = "debit";
    } else if (t.amount !== undefined) {
      // Single amount field - check type or sign
      if (t.type) {
        const typeValue = t.type.toLowerCase();
        type = (typeValue.includes("credit") || typeValue.includes("cr") || typeValue.includes("deposit") || typeValue.includes("income")) 
          ? "credit" 
          : "debit";
      } else if (t.amount < 0) {
        type = "debit";
      } else {
        // Check name for hints
        const lowerName = name.toLowerCase();
        const isLikelyCredit = lowerName.includes("salary") || lowerName.includes("refund") || 
          lowerName.includes("cashback") || lowerName.includes("interest") || 
          lowerName.includes("dividend") || lowerName.includes("received") ||
          lowerName.includes("credit") || lowerName.includes("deposit");
        type = isLikelyCredit ? "credit" : "debit";
      }
      amount = Math.abs(t.amount);
    }

    return {
      id: `json-${index}`,
      date: t.date || "",
      name,
      amount,
      type,
      category: categorizeTransaction(name),
    };
  });
};