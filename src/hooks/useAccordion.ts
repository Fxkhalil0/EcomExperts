import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

// Matches Tailwind's `lg` breakpoint. < lg = all collapsed; >= lg = first
// step open by default.
const LG_BREAKPOINT_PX = 1024;
const LG_MEDIA_QUERY = `(min-width: ${LG_BREAKPOINT_PX}px)`;

export interface UseAccordionOptions {
  stepIds: readonly string[];
  defaultOpenStepId?: string;
}

export interface UseAccordionResult {
  openStepId: string;
  matchesLg: boolean;
  open: (id: string) => void;
  registerHeaderRef: (index: number) => (el: HTMLButtonElement | null) => void;
  onHeaderKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => void;
}

function isLgOrWider(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(LG_MEDIA_QUERY).matches;
}

function defaultForViewport(
  stepIds: readonly string[],
  matchesLg: boolean,
): string {
  return matchesLg ? (stepIds[0] ?? "") : "";
}

// Headless accordion state: tracks the open step, header refs, keyboard
// nav, and viewport-driven default. Viewport sync stops once the user
// has manually opened a step so their choice persists across resizes.
export function useAccordion({
  stepIds,
  defaultOpenStepId,
}: UseAccordionOptions): UseAccordionResult {
  const [openStepId, setOpenStepId] = useState<string>(() => {
    if (defaultOpenStepId !== undefined) return defaultOpenStepId;
    return defaultForViewport(stepIds, isLgOrWider());
  });

  const [matchesLg, setMatchesLg] = useState<boolean>(() => isLgOrWider());

  const userInteractedRef = useRef(false);

  const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Mirror latest stepIds into a ref so the viewport-sync effect doesn't
  // re-subscribe when callers rebuild the array each render.
  const stepIdsRef = useRef(stepIds);
  useEffect(() => {
    stepIdsRef.current = stepIds;
  }, [stepIds]);

  const open = useCallback((id: string) => {
    userInteractedRef.current = true;
    setOpenStepId((prev) => (prev === id ? prev : id));
  }, []);

  // Track lg breakpoint at runtime.
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(LG_MEDIA_QUERY);
    const sync = () => setMatchesLg(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  // Re-apply viewport default when crossing lg — skipped when caller
  // controls openStepId or when the user has already interacted.
  useEffect(() => {
    if (defaultOpenStepId !== undefined) return;
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const mql = window.matchMedia(LG_MEDIA_QUERY);
    const sync = () => {
      if (userInteractedRef.current) return;
      setOpenStepId(defaultForViewport(stepIdsRef.current, mql.matches));
    };
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, [defaultOpenStepId]);

  const registerHeaderRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      headerRefs.current[index] = el;
    },
    [],
  );

  const focusHeader = useCallback((index: number) => {
    const len = headerRefs.current.length;
    if (len === 0) return;
    const wrapped = ((index % len) + len) % len;
    headerRefs.current[wrapped]?.focus();
  }, []);

  const stepCount = stepIds.length;
  const onHeaderKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusHeader(index + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusHeader(index - 1);
          break;
        case "Home":
          e.preventDefault();
          focusHeader(0);
          break;
        case "End":
          e.preventDefault();
          focusHeader(stepCount - 1);
          break;
      }
    },
    [focusHeader, stepCount],
  );

  return { openStepId, matchesLg, open, registerHeaderRef, onHeaderKeyDown };
}
