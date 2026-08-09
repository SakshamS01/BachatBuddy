"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Calendar,
  X,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Clock,
  Activity,
  Zap,
  Target,
  RefreshCw,
  ExternalLink,
  Star,
  Percent,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Check,
  Edit3,
  Users,
  Layers,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/finance-utils";
import { useMemo, useState, useCallback } from "react";
import { Subscription } from "@/lib/types";
import { InputSection } from "@/components/dashboard/input-section";

// Type for user-provided usage data
interface UserUsageInput {
  hoursPerDay: number;
  daysPerMonth: number;
  lastUsedDaysAgo: number;
  satisfaction: number; // 1-5
}

// Extended subscription with usage data
interface SubscriptionWithUsage extends Subscription {
  userUsage?: UserUsageInput;
}

// Calculate recommendation based on user input
const getRecommendationFromUsage = (
  subscription: Subscription,
  usage: UserUsageInput
) => {
  const monthlyHours = usage.hoursPerDay * usage.daysPerMonth;
  const costPerHour = subscription.amount / (monthlyHours || 1);
  const usagePercentage = Math.min(100, (monthlyHours / 30) * 100); // Assuming 30hrs/month is full usage

  let recommendation: "keep" | "cancel" | "downgrade" | "switch" = "keep";
  let reasonText = "";

  // Low usage - less than 5 hours per month
  if (monthlyHours < 5) {
    recommendation = "cancel";
    reasonText = `Very low usage detected (${monthlyHours.toFixed(1)} hrs/month). You're paying ${formatCurrency(costPerHour)}/hour. Consider cancelling.`;
  }
  // Moderate usage but high cost per hour
  else if (costPerHour > 50 && monthlyHours < 15) {
    recommendation = "downgrade";
    reasonText = `Moderate usage at ${monthlyHours.toFixed(1)} hrs/month but high cost (${formatCurrency(costPerHour)}/hr). Consider a cheaper plan.`;
  }
  // Haven't used recently
  else if (usage.lastUsedDaysAgo > 14) {
    recommendation = "cancel";
    reasonText = `You haven't used this in ${usage.lastUsedDaysAgo} days. Consider cancelling to save ${formatCurrency(subscription.amount)}/month.`;
  }
  // Low satisfaction
  else if (usage.satisfaction <= 2) {
    recommendation = "switch";
    reasonText = `Low satisfaction rating. There may be better alternatives that suit your needs.`;
  }
  // Good usage
  else if (monthlyHours >= 15 && usage.satisfaction >= 4) {
    recommendation = "keep";
    reasonText = `Great value! You use this ${monthlyHours.toFixed(1)} hrs/month at just ${formatCurrency(costPerHour)}/hr with high satisfaction.`;
  }
  // Decent usage
  else {
    recommendation = "keep";
    reasonText = `Fair usage at ${monthlyHours.toFixed(1)} hrs/month (${formatCurrency(costPerHour)}/hr). Monitor your usage to ensure value.`;
  }

  return {
    recommendation,
    reasonText,
    monthlyHours,
    costPerHour,
    usagePercentage,
    savingsIfCancelled: subscription.amount * 12,
  };
};

const getRecommendationConfig = (recommendation: string) => {
  const configs: Record<string, {
    color: string;
    bgColor: string;
    borderColor: string;
    icon: typeof AlertTriangle;
    title: string;
    badgeColor: string;
  }> = {
    cancel: {
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: AlertTriangle,
      title: "Consider Cancelling",
      badgeColor: "bg-red-100 text-red-700 border-red-200",
    },
    downgrade: {
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      icon: TrendingDown,
      title: "Downgrade Recommended",
      badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    },
    switch: {
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: RefreshCw,
      title: "Better Alternative Found",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
    },
    keep: {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      icon: Star,
      title: "Good Value",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
  };
  return configs[recommendation] || configs.keep;
};

// Alternative services mapping
const alternativeServices: Record<string, { name: string; price: number }[]> = {
  Entertainment: [
    { name: "JioCinema Premium", price: 89 },
    { name: "MX Player Pro", price: 99 },
    { name: "Zee5", price: 99 },
  ],
  Health: [
    { name: "Cult.fit Pay Per Session", price: 199 },
    { name: "Home Workouts (Free)", price: 0 },
  ],
  Utilities: [
    { name: "Budget Plan", price: 499 },
    { name: "Prepaid Option", price: 299 },
  ],
};

interface UsageInputDialogProps {
  subscription: Subscription;
  currentUsage?: UserUsageInput;
  onSave: (usage: UserUsageInput) => void;
}

const UsageInputDialog = ({ subscription, currentUsage, onSave }: UsageInputDialogProps) => {
  const [open, setOpen] = useState(false);
  const [hoursPerDay, setHoursPerDay] = useState(currentUsage?.hoursPerDay || 1);
  const [daysPerMonth, setDaysPerMonth] = useState(currentUsage?.daysPerMonth || 15);
  const [lastUsedDaysAgo, setLastUsedDaysAgo] = useState(currentUsage?.lastUsedDaysAgo || 1);
  const [satisfaction, setSatisfaction] = useState(currentUsage?.satisfaction || 3);

  const handleSave = () => {
    onSave({
      hoursPerDay,
      daysPerMonth,
      lastUsedDaysAgo,
      satisfaction,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit3 className="h-3 w-3" />
          {currentUsage ? "Update Usage" : "Add Usage Data"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Usage Data for {subscription.name}
          </DialogTitle>
          <DialogDescription>
            Help us provide better recommendations by telling us about your usage.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Hours per day</Label>
              <span className="text-sm font-medium" style={{ color: "#FF0000" }}>
                {hoursPerDay} hrs
              </span>
            </div>
            <Slider
              value={[hoursPerDay]}
              onValueChange={(v) => setHoursPerDay(v[0])}
              max={8}
              min={0.25}
              step={0.25}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How many hours do you typically use {subscription.name} each day?
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Days per month</Label>
              <span className="text-sm font-medium" style={{ color: "#FF0000" }}>
                {daysPerMonth} days
              </span>
            </div>
            <Slider
              value={[daysPerMonth]}
              onValueChange={(v) => setDaysPerMonth(v[0])}
              max={30}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              How many days per month do you use this service?
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Last used</Label>
              <span className="text-sm font-medium" style={{ color: "#FF0000" }}>
                {lastUsedDaysAgo === 0 ? "Today" : `${lastUsedDaysAgo} days ago`}
              </span>
            </div>
            <Slider
              value={[lastUsedDaysAgo]}
              onValueChange={(v) => setLastUsedDaysAgo(v[0])}
              max={30}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Satisfaction</Label>
              <span className="text-sm font-medium" style={{ color: "#FF0000" }}>
                {satisfaction}/5 {satisfaction >= 4 ? "Happy" : satisfaction >= 3 ? "Neutral" : "Unhappy"}
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <Button
                  key={val}
                  variant={satisfaction === val ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSatisfaction(val)}
                  className="flex-1"
                >
                  {val}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              How satisfied are you with this subscription?
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Usage Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SubscriptionCardProps {
  subscription: SubscriptionWithUsage;
  onCancel: (id: string) => void;
  onUpdateUsage: (id: string, usage: UserUsageInput) => void;
  groupInfo?: { count: number; totalCost: number; names: string[] };
}

const SubscriptionCard = ({ subscription, onCancel, onUpdateUsage, groupInfo }: SubscriptionCardProps) => {
  const [expanded, setExpanded] = useState(true);

  const usageAnalysis = subscription.userUsage
    ? getRecommendationFromUsage(subscription, subscription.userUsage)
    : null;

  const recConfig = usageAnalysis
    ? getRecommendationConfig(usageAnalysis.recommendation)
    : getRecommendationConfig("keep");
  const RecIcon = recConfig.icon;

  const alternatives = alternativeServices[subscription.category] || [];

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm">
      {/* Main Subscription Info */}
      <div className="p-4 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{subscription.name}</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {subscription.frequency}
                </span>
                <Badge variant="outline" className="text-xs">
                  {subscription.category}
                </Badge>
                {subscription.userUsage && (
                  <Badge variant="outline" className={recConfig.badgeColor}>
                    {recConfig.title}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-between sm:justify-end">
            <div className="text-right">
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(subscription.amount)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onCancel(subscription.id)}
              className="gap-1 shrink-0"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Usage Input Prompt (if no usage data) */}
      {!subscription.userUsage && (
        <div className="border-t border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-700 text-sm">Tell us about your usage</p>
                <p className="text-xs text-amber-600 mt-1">
                  Add your usage data to get personalized recommendations on whether to keep, cancel, or switch this subscription.
                </p>
              </div>
            </div>
            <UsageInputDialog
              subscription={subscription}
              onSave={(usage) => onUpdateUsage(subscription.id, usage)}
            />
          </div>
        </div>
      )}

      {/* Usage Statistics Ad Block (only if usage data exists) */}
      {subscription.userUsage && usageAnalysis && (
        <div className={`border-t-2 ${recConfig.borderColor} ${recConfig.bgColor}`}>
          <div className="p-4">
            {/* Header */}
            <button
              className="w-full flex items-center justify-between mb-4 cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" style={{ color: "#FF0000" }} />
                <span className="font-semibold text-sm" style={{ color: "#FF0000" }}>
                  Your Usage Analytics & Smart Insights
                </span>
              </div>
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {expanded && (
              <>
                {/* Usage Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="bg-white/80 rounded-lg p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="h-3 w-3" />
                      Daily Usage
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#FF0000" }}>
                      {subscription.userUsage.hoursPerDay} hrs
                    </p>
                    <p className="text-xs text-muted-foreground">avg per day</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      Monthly Usage
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#FF0000" }}>
                      {usageAnalysis.monthlyHours.toFixed(1)} hrs
                    </p>
                    <p className="text-xs text-muted-foreground">this month</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <IndianRupee className="h-3 w-3" />
                      Cost Per Hour
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#FF0000" }}>
                      {formatCurrency(usageAnalysis.costPerHour)}
                    </p>
                    <p className="text-xs text-muted-foreground">per hour used</p>
                  </div>
                  <div className="bg-white/80 rounded-lg p-3 border border-border/30">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Zap className="h-3 w-3" />
                      Last Active
                    </div>
                    <p className="text-lg font-bold" style={{ color: "#FF0000" }}>
                      {subscription.userUsage.lastUsedDaysAgo === 0
                        ? "Today"
                        : `${subscription.userUsage.lastUsedDaysAgo}d ago`}
                    </p>
                    <p className="text-xs text-muted-foreground">activity</p>
                  </div>
                </div>

                {/* Usage Progress */}
                <div className="mb-4 bg-white/60 rounded-lg p-3 border border-border/30">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Usage Efficiency Score</span>
                    <span className="font-bold" style={{ color: "#FF0000" }}>
                      {usageAnalysis.usagePercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={usageAnalysis.usagePercentage} className="h-3" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500" />
                      Satisfaction: {subscription.userUsage.satisfaction}/5
                    </span>
                    <UsageInputDialog
                      subscription={subscription}
                      currentUsage={subscription.userUsage}
                      onSave={(usage) => onUpdateUsage(subscription.id, usage)}
                    />
                  </div>
                </div>

                {/* Smart Recommendation Block */}
                <div className={`bg-white/80 border ${recConfig.borderColor} rounded-lg p-4`}>
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full ${recConfig.bgColor} flex items-center justify-center border ${recConfig.borderColor} shrink-0`}>
                      <RecIcon className={`h-5 w-5 ${recConfig.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span className={`font-semibold text-sm ${recConfig.color}`}>
                          Smart Recommendation
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-3">
                        {usageAnalysis.reasonText}
                      </p>

                      {/* Savings Highlight */}
                      {usageAnalysis.recommendation !== "keep" && (
                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg border border-red-200/50 mb-3">
                          <Percent className="h-4 w-4" style={{ color: "#FF0000" }} />
                          <span className="text-sm">
                            Potential savings:
                            <span style={{ color: "#FF0000" }} className="font-bold ml-1">
                              {formatCurrency(usageAnalysis.savingsIfCancelled)}/year
                            </span>
                          </span>
                        </div>
                      )}

                      {/* Alternative Services */}
                      {usageAnalysis.recommendation !== "keep" && alternatives.length > 0 && (
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
                          <p className="text-xs text-muted-foreground mb-2 font-medium">Suggested Alternatives</p>
                          <div className="space-y-2">
                            {alternatives.slice(0, 2).map((alt) => (
                              <div key={alt.name} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Star className="h-3 w-3 text-primary" />
                                  <span className="text-sm font-medium">{alt.name}</span>
                                </div>
                                <span className="font-bold text-sm" style={{ color: "#FF0000" }}>
                                  {alt.price === 0 ? "Free" : formatCurrency(alt.price)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Group Warning */}
      {groupInfo && groupInfo.count > 1 && (
        <div className="border-t border-purple-200 bg-purple-50 p-4">
          <div className="flex items-start gap-3">
            <Layers className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-700 text-sm flex items-center gap-2">
                Multiple {subscription.category} Subscriptions
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                  {groupInfo.count} services
                </Badge>
              </p>
              <p className="text-xs text-purple-600 mt-1">
                You have {groupInfo.count} subscriptions in {subscription.category}: {groupInfo.names.join(", ")}.
                Total cost: <span className="font-bold" style={{ color: "#FF0000" }}>{formatCurrency(groupInfo.totalCost)}/month</span>.
                Consider keeping only one to save!
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default function SubscriptionsPage() {
  const { subscriptions, cancelSubscription, summary, hasData } = useFinance();
  const [usageData, setUsageData] = useState<Record<string, UserUsageInput>>({});

  // Merge subscriptions with user usage data
  const subscriptionsWithUsage: SubscriptionWithUsage[] = useMemo(() => {
    return subscriptions.map((sub) => ({
      ...sub,
      userUsage: usageData[sub.id],
    }));
  }, [subscriptions, usageData]);

  // Group subscriptions by category
  const subscriptionGroups = useMemo(() => {
    const groups: Record<string, Subscription[]> = {};
    for (const sub of subscriptions) {
      if (!groups[sub.category]) {
        groups[sub.category] = [];
      }
      groups[sub.category].push(sub);
    }
    return groups;
  }, [subscriptions]);

  // Get group info for each subscription
  const getGroupInfo = useCallback((subscription: Subscription) => {
    const group = subscriptionGroups[subscription.category];
    if (!group || group.length <= 1) return undefined;
    return {
      count: group.length,
      totalCost: group.reduce((sum, s) => sum + s.amount, 0),
      names: group.map((s) => s.name),
    };
  }, [subscriptionGroups]);

  const handleUpdateUsage = useCallback((id: string, usage: UserUsageInput) => {
    setUsageData((prev) => ({ ...prev, [id]: usage }));
  }, []);

  const activeSubscriptions = subscriptionsWithUsage.filter((s) => s.isActive);
  const totalMonthlySpend = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);

  // Calculate recommendations summary
  const recommendationsSummary = useMemo(() => {
    let cancelCount = 0;
    let downgradeCount = 0;
    let potentialSavings = 0;

    for (const sub of activeSubscriptions) {
      if (sub.userUsage) {
        const analysis = getRecommendationFromUsage(sub, sub.userUsage);
        if (analysis.recommendation === "cancel") {
          cancelCount++;
          potentialSavings += sub.amount * 12;
        } else if (analysis.recommendation === "downgrade") {
          downgradeCount++;
          potentialSavings += sub.amount * 6; // Assume 50% savings on downgrade
        }
      }
    }

    return { cancelCount, downgradeCount, potentialSavings };
  }, [activeSubscriptions]);

  // Categories with multiple subscriptions
  const duplicateCategories = useMemo(() => {
    return Object.entries(subscriptionGroups)
      .filter(([_, subs]) => subs.filter((s) => s.isActive).length > 1)
      .map(([category, subs]) => ({
        category,
        count: subs.filter((s) => s.isActive).length,
        totalCost: subs.filter((s) => s.isActive).reduce((sum, s) => sum + s.amount, 0),
      }));
  }, [subscriptionGroups]);

  if (!hasData) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track your recurring payments
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <InputSection />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
        <p className="mt-1 text-muted-foreground">
          Add your usage data to get personalized recommendations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {activeSubscriptions.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Recurring payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#FF0000" }}>
              {formatCurrency(totalMonthlySpend)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              On subscriptions
            </p>
          </CardContent>
        </Card>

        <Card className={recommendationsSummary.cancelCount > 0 ? "border-red-200 bg-red-50/50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#FF0000" }}>
              {recommendationsSummary.cancelCount + recommendationsSummary.downgradeCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Potential Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(recommendationsSummary.potentialSavings)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Per year if optimized
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Duplicate Category Alert */}
      {duplicateCategories.length > 0 && (
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Users className="h-5 w-5" />
              Multiple Subscriptions in Same Category
            </CardTitle>
            <CardDescription className="text-purple-600">
              You can save by keeping only one subscription per category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {duplicateCategories.map((cat) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between rounded-lg bg-white/80 p-3 border border-purple-200"
                >
                  <div>
                    <p className="font-medium text-foreground">{cat.category}</p>
                    <p className="text-xs text-muted-foreground">{cat.count} subscriptions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold" style={{ color: "#FF0000" }}>
                      {formatCurrency(cat.totalCost)}
                    </p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Your Subscriptions
          </h2>
        </div>

        {activeSubscriptions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No active subscriptions detected.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onCancel={cancelSubscription}
                onUpdateUsage={handleUpdateUsage}
                groupInfo={getGroupInfo(subscription)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
