"use client";

import { Suspense } from "react";

import { PlatsPageContent } from "./_components/plats-page-content";

function PlatsPageFallback() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-start justify-between">
        <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-[400px] animate-pulse rounded-md border bg-muted/30" />
      </div>
    </div>
  );
}

export default function PlatsPage() {
  return (
    <Suspense fallback={<PlatsPageFallback />}>
      <PlatsPageContent />
    </Suspense>
  );
}
