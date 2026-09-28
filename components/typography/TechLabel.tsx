import type { ReactNode } from "react";

export default function TechLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`tech-label ${className}`}>{children}</span>;
}
