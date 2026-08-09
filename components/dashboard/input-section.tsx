"use client";

import { useState, useCallback } from "react";
import { useFinance } from "@/contexts/finance-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  IndianRupee, 
  Plus, 
  FileJson, 
  FileSpreadsheet,
  Play,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

export function InputSection() {
  const { 
    monthlyIncome, 
    setMonthlyIncome, 
    loadDemoData, 
    parseAndLoadFile,
    addManualExpense,
    transactions,
    analyzeData,
  } = useFinance();

  const [income, setIncome] = useState(monthlyIncome.toString() || "");
  const [manualExpense, setManualExpense] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleIncomeChange = (value: string) => {
    setIncome(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setMonthlyIncome(numValue);
    }
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setFileError(null);
      const fileName = file.name.toLowerCase();

      if (!fileName.endsWith(".csv") && !fileName.endsWith(".json")) {
        setFileError("Please upload a CSV or JSON file");
        return;
      }

      try {
        const content = await file.text();
        const fileType = fileName.endsWith(".csv") ? "csv" : "json";
        parseAndLoadFile(content, fileType);
        toast.success(`Successfully loaded ${file.name}`);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : "Failed to parse file. Please check the format.";
        setFileError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [parseAndLoadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleManualExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualExpense.name || !manualExpense.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    addManualExpense({
      name: manualExpense.name,
      amount: parseFloat(manualExpense.amount),
      date: manualExpense.date,
    });

    toast.success("Expense added successfully");
    setManualExpense({
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleLoadDemo = () => {
    loadDemoData();
    setIncome("75000");
    toast.success("Demo data loaded successfully");
  };

  const handleAnalyze = () => {
    if (transactions.length === 0) {
      toast.error("Please add transactions first");
      return;
    }
    if (monthlyIncome <= 0) {
      toast.error("Please enter your monthly income");
      return;
    }
    analyzeData();
  };

  return (
    <div className="space-y-6">
      {/* Income Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 text-primary" />
            Monthly Income
          </CardTitle>
          <CardDescription>
            Enter your total monthly income to calculate savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                placeholder="75000"
                value={income}
                onChange={(e) => handleIncomeChange(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" onClick={handleLoadDemo}>
              <Play className="mr-2 h-4 w-4" />
              Load Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Input Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Add Transactions</CardTitle>
          <CardDescription>
            Upload a file or manually add your expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2">
                <Plus className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-4">
              {fileError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fileError}</AlertDescription>
                </Alert>
              )}

              <div
                className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept=".csv,.json"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileJson className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Drop your file here or click to browse
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Supports CSV and JSON files
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium text-foreground">
                  Expected format:
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  CSV: date, name, amount
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  {`JSON: [{ "date": "2024-01-01", "name": "Netflix", "amount": 649 }]`}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <form onSubmit={handleManualExpenseSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Expense Name</FieldLabel>
                    <Input
                      placeholder="e.g., Zomato, Uber, Netflix"
                      value={manualExpense.name}
                      onChange={(e) =>
                        setManualExpense((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Amount</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          type="number"
                          placeholder="500"
                          value={manualExpense.amount}
                          onChange={(e) =>
                            setManualExpense((prev) => ({
                              ...prev,
                              amount: e.target.value,
                            }))
                          }
                          className="pl-8"
                        />
                      </div>
                    </Field>

                    <Field>
                      <FieldLabel>Date</FieldLabel>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="date"
                          value={manualExpense.date}
                          onChange={(e) =>
                            setManualExpense((prev) => ({
                              ...prev,
                              date: e.target.value,
                            }))
                          }
                          className="pl-10"
                        />
                      </div>
                    </Field>
                  </div>
                </FieldGroup>

                <Button type="submit" className="mt-4 w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Analyze Button */}
      {transactions.length > 0 && monthlyIncome > 0 && (
        <Button size="lg" className="w-full" onClick={handleAnalyze}>
          <Play className="mr-2 h-5 w-5" />
          Analyze My Finances
        </Button>
      )}

      {/* Transaction Count */}
      {transactions.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          {transactions.length} transactions loaded
        </p>
      )}
    </div>
  );
}
