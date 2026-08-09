"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useFinance } from "@/contexts/finance-context";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isDemo = searchParams.get("demo") === "true";
  
  const { 
    hasData, 
    loadDemoData, 
    setMonthlyIncome,
    analyzeData,
  } = useFinance();

  // Load demo data if requested
  useEffect(() => {
    if (isDemo && !hasData) {
      loadDemoData();
      setMonthlyIncome(75000);
      setTimeout(() => {
        analyzeData();
      }, 100);
    }
  }, [isDemo, hasData, loadDemoData, setMonthlyIncome, analyzeData]);

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <main className="lg:pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
