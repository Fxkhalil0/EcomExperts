import { describe, expect, it } from "vitest";
import { CATALOG_CATEGORIES, buildCatalogIndex } from "@/helpers/catalog";
import { testCatalog } from "@/test/fixtures";

describe("CATALOG_CATEGORIES", () => {
  it("lists the four catalog categories in order", () => {
    expect(CATALOG_CATEGORIES).toEqual([
      "cameras",
      "plans",
      "sensors",
      "accessories",
    ]);
  });

  it("is frozen", () => {
    expect(Object.isFrozen(CATALOG_CATEGORIES)).toBe(true);
  });
});

describe("buildCatalogIndex", () => {
  it("indexes every product by id", () => {
    const { byId } = buildCatalogIndex(testCatalog);
    expect(byId.size).toBe(5);
    expect(byId.get(1)?.title).toBe("Camera A");
    expect(byId.get(2)?.title).toBe("Camera B");
    expect(byId.get(10)?.title).toBe("Plan A");
    expect(byId.get(20)?.title).toBe("Sensor A");
    expect(byId.get(30)?.title).toBe("Accessory A");
  });

  it("maps each product id to its category", () => {
    const { categoryOf } = buildCatalogIndex(testCatalog);
    expect(categoryOf.get(1)).toBe("cameras");
    expect(categoryOf.get(2)).toBe("cameras");
    expect(categoryOf.get(10)).toBe("plans");
    expect(categoryOf.get(20)).toBe("sensors");
    expect(categoryOf.get(30)).toBe("accessories");
  });

  it("returns undefined for unknown ids", () => {
    const { byId, categoryOf } = buildCatalogIndex(testCatalog);
    expect(byId.get(9999)).toBeUndefined();
    expect(categoryOf.get(9999)).toBeUndefined();
  });
});
