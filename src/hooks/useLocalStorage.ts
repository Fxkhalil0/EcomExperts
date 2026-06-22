import { useCallback } from "react";
import { safeReadString, safeWriteString } from "@/helpers/localStorage";

export interface UseLocalStorageResult<T> {
  read: () => T | null;
  write: (value: T) => boolean;
}

// Minimal typed localStorage adapter — deliberately does NOT mirror
// storage into React state. Use `read()` inside a lazy reducer/state
// initializer and call `write()` from event handlers. `parse` must not
// throw.
export function useLocalStorage<T>(
  key: string,
  parse: (raw: string | null) => T | null,
  serialize: (value: T) => string = JSON.stringify,
): UseLocalStorageResult<T> {
  const read = useCallback(
    (): T | null => parse(safeReadString(key)),
    [key, parse],
  );
  const write = useCallback(
    (value: T): boolean => safeWriteString(key, serialize(value)),
    [key, serialize],
  );
  return { read, write };
}
