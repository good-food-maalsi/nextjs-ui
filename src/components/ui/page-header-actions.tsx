import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageHeaderActions({
  children,
  className,
  ...props
}: PageHeaderActionsProps) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      {children}
    </div>
  );
}
