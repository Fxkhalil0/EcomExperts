import type { ReactNode } from "react";
import type { Category } from "@/data/products";
import { AccessoriesIcon, CameraIcon, PlanIcon, SensorsIcon } from "@/icons";

// Static ReactNode constants so identities stay stable across renders and
// memoized children skip re-renders.
export const categoryIcons: Record<Category, ReactNode> = {
  cameras: <CameraIcon />,
  plans: <PlanIcon />,
  sensors: <SensorsIcon />,
  accessories: <AccessoriesIcon />,
};
