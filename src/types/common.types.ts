export type Category = "cameras" | "plans" | "sensors" | "accessories";

// All monetary amounts are integers in the smallest currency unit (e.g.
// cents) — working in integers avoids floating-point rounding.
export type MinorUnits = number;

export type ClassValue = string | false | null | undefined;

export interface CategoryDescriptor {
  id: Category;
  label: string;
}
