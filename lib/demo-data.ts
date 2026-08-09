import type { Transaction, UsageData } from "./types";
import { categorizeTransaction } from "./finance-utils";

export const demoTransactions: Transaction[] = [
  // Income/Credit transactions
  { id: "0", date: "2024-01-01", name: "Salary Credit", amount: 75000, category: "Income", type: "credit" },
  { id: "0a", date: "2024-02-01", name: "Salary Credit", amount: 75000, category: "Income", type: "credit" },
  { id: "0b", date: "2024-03-01", name: "Salary Credit", amount: 75000, category: "Income", type: "credit" },
  { id: "0c", date: "2024-01-15", name: "Cashback Received", amount: 250, category: "Income", type: "credit" },
  { id: "0d", date: "2024-02-20", name: "Interest Credit", amount: 1200, category: "Income", type: "credit" },
  { id: "0e", date: "2024-03-05", name: "Refund - Amazon", amount: 850, category: "Income", type: "credit" },

  // Netflix subscriptions (recurring)
  { id: "1", date: "2024-01-05", name: "Netflix", amount: 649, category: "Entertainment", type: "debit" },
  { id: "2", date: "2024-02-05", name: "Netflix", amount: 649, category: "Entertainment", type: "debit" },
  { id: "3", date: "2024-03-05", name: "Netflix", amount: 649, category: "Entertainment", type: "debit" },

  // Spotify subscriptions (recurring)
  { id: "4", date: "2024-01-10", name: "Spotify Premium", amount: 119, category: "Entertainment", type: "debit" },
  { id: "5", date: "2024-02-10", name: "Spotify Premium", amount: 119, category: "Entertainment", type: "debit" },
  { id: "6", date: "2024-03-10", name: "Spotify Premium", amount: 119, category: "Entertainment", type: "debit" },

  // Amazon Prime (recurring)
  { id: "7", date: "2024-01-15", name: "Amazon Prime", amount: 299, category: "Entertainment", type: "debit" },
  { id: "8", date: "2024-02-15", name: "Amazon Prime", amount: 299, category: "Entertainment", type: "debit" },
  { id: "9", date: "2024-03-15", name: "Amazon Prime", amount: 299, category: "Entertainment", type: "debit" },

  // YouTube Premium (recurring)
  { id: "10", date: "2024-01-20", name: "YouTube Premium", amount: 129, category: "Entertainment", type: "debit" },
  { id: "11", date: "2024-02-20", name: "YouTube Premium", amount: 129, category: "Entertainment", type: "debit" },
  { id: "12", date: "2024-03-20", name: "YouTube Premium", amount: 129, category: "Entertainment", type: "debit" },

  // Food expenses
  { id: "13", date: "2024-01-02", name: "Zomato", amount: 450, category: "Food", type: "debit" },
  { id: "14", date: "2024-01-08", name: "Swiggy", amount: 380, category: "Food", type: "debit" },
  { id: "15", date: "2024-01-14", name: "Zomato", amount: 520, category: "Food", type: "debit" },
  { id: "16", date: "2024-01-21", name: "Swiggy", amount: 290, category: "Food", type: "debit" },
  { id: "17", date: "2024-01-28", name: "Dominos", amount: 650, category: "Food", type: "debit" },
  { id: "18", date: "2024-02-05", name: "Zomato", amount: 410, category: "Food", type: "debit" },
  { id: "19", date: "2024-02-12", name: "Swiggy", amount: 340, category: "Food", type: "debit" },
  { id: "20", date: "2024-02-19", name: "Starbucks", amount: 580, category: "Food", type: "debit" },
  { id: "21", date: "2024-02-26", name: "Zomato", amount: 480, category: "Food", type: "debit" },
  { id: "22", date: "2024-03-04", name: "Swiggy", amount: 360, category: "Food", type: "debit" },
  { id: "23", date: "2024-03-11", name: "McDonalds", amount: 420, category: "Food", type: "debit" },
  { id: "24", date: "2024-03-18", name: "Zomato", amount: 390, category: "Food", type: "debit" },

  // Travel expenses
  { id: "25", date: "2024-01-03", name: "Uber", amount: 250, category: "Travel", type: "debit" },
  { id: "26", date: "2024-01-09", name: "Ola", amount: 180, category: "Travel", type: "debit" },
  { id: "27", date: "2024-01-16", name: "Uber", amount: 320, category: "Travel", type: "debit" },
  { id: "28", date: "2024-01-23", name: "Metro", amount: 150, category: "Travel", type: "debit" },
  { id: "29", date: "2024-01-30", name: "Petrol", amount: 1500, category: "Travel", type: "debit" },
  { id: "30", date: "2024-02-06", name: "Uber", amount: 280, category: "Travel", type: "debit" },
  { id: "31", date: "2024-02-13", name: "Ola", amount: 220, category: "Travel", type: "debit" },
  { id: "32", date: "2024-02-20", name: "Metro", amount: 180, category: "Travel", type: "debit" },
  { id: "33", date: "2024-02-27", name: "Petrol", amount: 1600, category: "Travel", type: "debit" },
  { id: "34", date: "2024-03-05", name: "Uber", amount: 300, category: "Travel", type: "debit" },
  { id: "35", date: "2024-03-12", name: "Rapido", amount: 120, category: "Travel", type: "debit" },

  // Shopping
  { id: "36", date: "2024-01-07", name: "Amazon Shopping", amount: 2500, category: "Shopping", type: "debit" },
  { id: "37", date: "2024-01-18", name: "Flipkart", amount: 1800, category: "Shopping", type: "debit" },
  { id: "38", date: "2024-02-08", name: "Myntra", amount: 3200, category: "Shopping", type: "debit" },
  { id: "39", date: "2024-02-22", name: "BigBasket", amount: 1200, category: "Shopping", type: "debit" },
  { id: "40", date: "2024-03-03", name: "Zepto", amount: 450, category: "Shopping", type: "debit" },
  { id: "41", date: "2024-03-15", name: "Amazon Shopping", amount: 1950, category: "Shopping", type: "debit" },

  // Utilities
  { id: "42", date: "2024-01-01", name: "Electricity Bill", amount: 2200, category: "Utilities", type: "debit" },
  { id: "43", date: "2024-02-01", name: "Electricity Bill", amount: 2400, category: "Utilities", type: "debit" },
  { id: "44", date: "2024-03-01", name: "Electricity Bill", amount: 2100, category: "Utilities", type: "debit" },
  { id: "45", date: "2024-01-05", name: "Jio Fiber", amount: 999, category: "Utilities", type: "debit" },
  { id: "46", date: "2024-02-05", name: "Jio Fiber", amount: 999, category: "Utilities", type: "debit" },
  { id: "47", date: "2024-03-05", name: "Jio Fiber", amount: 999, category: "Utilities", type: "debit" },

  // Health
  { id: "48", date: "2024-01-12", name: "Cult Fit", amount: 999, category: "Health", type: "debit" },
  { id: "49", date: "2024-02-12", name: "Cult Fit", amount: 999, category: "Health", type: "debit" },
  { id: "50", date: "2024-03-12", name: "Cult Fit", amount: 999, category: "Health", type: "debit" },
  { id: "51", date: "2024-02-15", name: "Apollo Pharmacy", amount: 850, category: "Health", type: "debit" },

  // Others
  { id: "52", date: "2024-01-25", name: "ATM Withdrawal", amount: 5000, category: "Others", type: "debit" },
  { id: "53", date: "2024-02-18", name: "Gift Purchase", amount: 1500, category: "Others", type: "debit" },
  { id: "54", date: "2024-03-10", name: "ATM Withdrawal", amount: 3000, category: "Others", type: "debit" },
];

export const demoUsageData: UsageData[] = [
  { appName: "Netflix", hoursPerMonth: 25, cost: 649 },
  { appName: "Spotify Premium", hoursPerMonth: 40, cost: 119 },
  { appName: "Amazon Prime", hoursPerMonth: 8, cost: 299 },
  { appName: "YouTube Premium", hoursPerMonth: 3, cost: 129 }, // Low usage
  { appName: "Cult Fit", hoursPerMonth: 2, cost: 999 }, // Low usage
];

export const defaultMonthlyIncome = 75000;

export const generateSampleTransactions = (count: number = 30): Transaction[] => {
  const merchants = [
    { name: "Netflix", category: "Entertainment", minAmount: 649, maxAmount: 649, type: "debit" as const },
    { name: "Spotify", category: "Entertainment", minAmount: 119, maxAmount: 119, type: "debit" as const },
    { name: "Zomato", category: "Food", minAmount: 200, maxAmount: 800, type: "debit" as const },
    { name: "Swiggy", category: "Food", minAmount: 150, maxAmount: 600, type: "debit" as const },
    { name: "Uber", category: "Travel", minAmount: 100, maxAmount: 500, type: "debit" as const },
    { name: "Ola", category: "Travel", minAmount: 80, maxAmount: 400, type: "debit" as const },
    { name: "Amazon", category: "Shopping", minAmount: 500, maxAmount: 5000, type: "debit" as const },
    { name: "Flipkart", category: "Shopping", minAmount: 300, maxAmount: 3000, type: "debit" as const },
    { name: "Electricity Bill", category: "Utilities", minAmount: 1500, maxAmount: 3000, type: "debit" as const },
    { name: "Internet", category: "Utilities", minAmount: 800, maxAmount: 1500, type: "debit" as const },
    { name: "Salary Credit", category: "Income", minAmount: 50000, maxAmount: 100000, type: "credit" as const },
    { name: "Cashback Received", category: "Income", minAmount: 50, maxAmount: 500, type: "credit" as const },
    { name: "Refund", category: "Income", minAmount: 100, maxAmount: 2000, type: "credit" as const },
  ];

  const transactions: Transaction[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    transactions.push({
      id: `gen-${i}`,
      date: date.toISOString().split("T")[0],
      name: merchant.name,
      amount:
        Math.floor(Math.random() * (merchant.maxAmount - merchant.minAmount + 1)) +
        merchant.minAmount,
      category: merchant.category,
      type: merchant.type,
    });
  }

  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
