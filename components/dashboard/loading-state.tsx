"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export function LoadingState() {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Spinner className="h-12 w-12 text-primary" />
        <h3 className="mt-6 text-xl font-semibold text-foreground">
          Analyzing your finances...
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Detecting subscriptions and generating insights
        </p>
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 animate-pulse rounded-full bg-primary"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
