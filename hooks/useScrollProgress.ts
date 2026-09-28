"use client";

import { useRef } from "react";
import type { ScrollProgress } from "@/types";

// Continuous animation state never passes through React's render cycle.
export function useScrollProgress() {
  return useRef<ScrollProgress>(0);
}
