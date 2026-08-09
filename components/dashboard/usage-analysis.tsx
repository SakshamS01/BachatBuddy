"use client";

import { useState } from "react";
import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { formatCurrency } from "@/lib/finance-utils";
import { Clock, AlertTriangle, Check, Plus, X } from "lucide-react";
import type { UsageData } from "@/lib/types";
import { demoUsageData } from "@/lib/demo-data";
import { toast } from "sonner";

export function UsageAnalysis() {
  const { subscriptions, usageData, setUsageData, analyzeData } = useFinance();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsage, setNewUsage] = useState<UsageData>({
    appName: "",
    hoursPerMonth: 0,
    cost: 0,
  });

  const handleLoadDemoUsage = () => {
    setUsageData(demoUsageData);
    toast.success("Demo usage data loaded");
    // Re-analyze with usage data
    setTimeout(() => analyzeData(), 100);
  };

  const handleAddUsage = () => {
    if (!newUsage.appName) {
      toast.error("Please enter an app name");
      return;
    }
    setUsageData([...usageData, newUsage]);
    setNewUsage({ appName: "", hoursPerMonth: 0, cost: 0 });
    setShowAddForm(false);
    toast.success("Usage data added");
    // Re-analyze with new usage data
    setTimeout(() => analyzeData(), 100);
  };

  const handleRemoveUsage = (appName: string) => {
    setUsageData(usageData.filter((u) => u.appName !== appName));
    toast.success("Usage data removed");
  };

  // Calculate efficiency for each subscription
  const getEfficiencyData = () => {
    return subscriptions
      .filter((s) => s.isActive)
      .map((sub) => {
        const usage = usageData.find(
          (u) => u.appName.toLowerCase() === sub.name.toLowerCase()
        );
        const hours = usage?.hoursPerMonth || 0;
        const costPerHour = hours > 0 ? sub.amount / hours : sub.amount;
        const isEfficient = hours >= 5; // More than 5 hours = efficient

        return {
          name: sub.name,
          cost: sub.amount,
          hours,
          costPerHour,
          isEfficient,
          hasUsageData: !!usage,
        };
      });
  };

  const efficiencyData = getEfficiencyData();
  const inefficientSubs = efficiencyData.filter(
    (e) => e.hasUsageData && !e.isEfficient
  );
  const potentialWaste = inefficientSubs.reduce((sum, e) => sum + e.cost, 0);

  if (!subscriptions || subscriptions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
              <Clock className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <CardTitle>Usage Analysis</CardTitle>
              <CardDescription>
                Track usage to identify waste
              </CardDescription>
            </div>
          </div>
          {usageData.length === 0 && (
            <Button variant="outline" size="sm" onClick={handleLoadDemoUsage}>
              Load Demo Usage
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Waste alert */}
        {potentialWaste > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-foreground">
                Low usage detected
              </p>
              <p className="text-sm text-muted-foreground">
                {inefficientSubs.length} subscription(s) with low usage costing{" "}
                {formatCurrency(potentialWaste)}/month
              </p>
            </div>
          </div>
        )}

        {/* Usage list */}
        <div className="space-y-4">
          {efficiencyData.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.name}</span>
                  {item.hasUsageData ? (
                    item.isEfficient ? (
                      <Badge
                        variant="secondary"
                        className="gap-1 bg-chart-1/10 text-chart-1"
                      >
                        <Check className="h-3 w-3" />
                        Good usage
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Low usage
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      No usage data
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(item.cost)}
                  </span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </div>
              </div>
              {item.hasUsageData && (
                <>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.hours} hours/month</span>
                    <span>
                      {formatCurrency(item.costPerHour)}/hour
                    </span>
                  </div>
                  <Progress
                    value={Math.min((item.hours / 30) * 100, 100)}
                    className={`h-2 ${
                      item.isEfficient ? "[&>div]:bg-chart-1" : "[&>div]:bg-destructive"
                    }`}
                  />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Manual usage data entry */}
        {usageData.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-muted-foreground">
                Your Usage Data
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
            {showAddForm && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>App Name</FieldLabel>
                    <Input
                      placeholder="e.g., Netflix"
                      value={newUsage.appName}
                      onChange={(e) =>
                        setNewUsage((prev) => ({ ...prev, appName: e.target.value }))
                      }
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Hours/Month</FieldLabel>
                    <Input
                      type="number"
                      placeholder="10"
                      value={newUsage.hoursPerMonth || ""}
                      onChange={(e) =>
                        setNewUsage((prev) => ({
                          ...prev,
                          hoursPerMonth: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </Field>
                </FieldGroup>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={handleAddUsage}>
                    Add Usage
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {usageData.map((usage) => (
                <div
                  key={usage.appName}
                  className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
                >
                  <div>
                    <span className="text-sm font-medium text-foreground">
                      {usage.appName}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {usage.hoursPerMonth}h/month
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveUsage(usage.appName)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
