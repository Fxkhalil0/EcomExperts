import type {
  Product,
  ProductCatalog,
  ProductLookup,
} from "@/types";
import { buildCatalogIndex } from "@/helpers/catalog";

// Plain product, no discount, no variants
export const cameraA: Product = {
  id: 1,
  title: "Camera A",
  description: "",
  image: "/img/cam-a.png",
  price: 19999,
};

// Product with variants (no discount)
export const cameraB: Product = {
  id: 2,
  title: "Camera B",
  description: "",
  image: "/img/cam-b.png",
  price: 24999,
  variants: [
    { id: 201, name: "Black", thumbnail: "/img/cam-b-black.png" },
    { id: 202, name: "White", thumbnail: "/img/cam-b-white.png" },
  ],
};

// Product with discount
export const planA: Product = {
  id: 10,
  title: "Plan A",
  description: "",
  image: "/img/plan-a.png",
  discount: { amount: 200, priceBefore: 1200, priceAfter: 1000 },
};

export const sensorA: Product = {
  id: 20,
  title: "Sensor A",
  description: "",
  image: "/img/sensor-a.png",
  price: 4999,
};

export const accessoryA: Product = {
  id: 30,
  title: "Accessory A",
  description: "",
  image: "/img/acc-a.png",
  price: 999,
};

export const testCatalog: ProductCatalog = {
  cameras: [cameraA, cameraB],
  plans: [planA],
  sensors: [sensorA],
  accessories: [accessoryA],
};

export const testCatalogIndex = buildCatalogIndex(testCatalog);

export const testProductLookup: ProductLookup = testCatalogIndex.byId;
