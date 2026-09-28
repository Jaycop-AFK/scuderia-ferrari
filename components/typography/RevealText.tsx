import type { ReactNode } from "react";

export default function RevealText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`reveal-text ${className}`} data-reveal="">{children}</p>;
}
