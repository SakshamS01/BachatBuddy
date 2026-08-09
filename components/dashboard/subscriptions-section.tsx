"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/finance-utils";
import { Repeat, X, AlertTriangle, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function SubscriptionsSection() {
  const { subscriptions, cancelSubscription, summary } = useFinance();

  const handleCancelSubscription = (subscriptionId: string, name: string) => {
    cancelSubscription(subscriptionId);
    toast.success(`${name} marked as cancelled`);
  };

  if (!subscriptions || subscriptions.length === 0) return null;

  const activeSubscriptions = subscriptions.filter((s) => s.isActive);
  const cancelledSubscriptions = subscriptions.filter((s) => !s.isActive);

  const totalActive = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  const lowUsageSubscriptions = activeSubscriptions.filter((s) => s.lowUsage);
  const potentialSavings = lowUsageSubscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Repeat className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Subscriptions
                <Badge variant="secondary" className="font-normal">
                  {activeSubscriptions.length} active
                </Badge>
              </CardTitle>
              <CardDescription>
                Recurring monthly payments detected
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(totalActive)}
            </p>
            <p className="text-xs text-muted-foreground">per month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Potential savings alert */}
        {potentialSavings > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-chart-3/30 bg-chart-3/10 p-4">
            <Sparkles className="h-5 w-5 text-chart-3" />
            <div>
              <p className="font-medium text-foreground">
                Potential savings detected!
              </p>
              <p className="text-sm text-muted-foreground">
                You could save {formatCurrency(potentialSavings)}/month by
                cancelling low-usage subscriptions.
              </p>
            </div>
          </div>
        )}

        {/* Active Subscriptions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Active Subscriptions
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {activeSubscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className={`relative rounded-lg border p-4 transition-colors ${
                  subscription.lowUsage
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-card"
                }`}
              >
                {subscription.lowUsage && (
                  <div className="absolute -right-1 -top-1">
                    <Badge variant="destructive" className="gap-1 text-xs">
                      <AlertTriangle className="h-3 w-3" />
                      Low Usage
                    </Badge>
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-foreground">
                      {subscription.name}
                    </h5>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subscription.category}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(subscription.amount)}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {subscription.frequency}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() =>
                      handleCancelSubscription(subscription.id, subscription.name)
                    }
                  >
                    <X className="h-3 w-3" />
                    Cancel & Save
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancelled Subscriptions */}
        {cancelledSubscriptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Cancelled
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {cancelledSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="rounded-lg border border-border bg-muted/50 p-4 opacity-60"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-foreground line-through">
                        {subscription.name}
                      </h5>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {subscription.category}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground line-through">
                      {formatCurrency(subscription.amount)}
                    </p>
                  </div>
                  <div className="mt-3">
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-chart-1/10 text-chart-1"
                    >
                      <Check className="h-3 w-3" />
                      Saving {formatCurrency(subscription.amount)}/month
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total subscription summary */}
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Subscription Cost
              </p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalActive)}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Yearly Cost</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(totalActive * 12)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
