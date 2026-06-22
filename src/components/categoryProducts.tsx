import { memo, useCallback, useMemo } from "react";
import { ProductCard } from "@/components/productCard";
import { useBundle } from "@/hooks/useBundle";
import {
  getCompareAtPrice,
  getCurrentPrice,
  getDiscountAmount,
} from "@/helpers/pricing.helper";
import type { Product } from "@/types";

export interface CategoryProductsProps {
  products: readonly Product[];
}

export const CategoryProducts = memo(function CategoryProducts({
  products,
}: CategoryProductsProps) {
  const {
    selectedVariants,
    getQuantity,
    incrementQuantity,
    decrementQuantity,
    changeVariant,
  } = useBundle();

  return (
    <div className="grid grid-cols-1 gap-[15px] lg:grid-cols-2 lg:items-center xl:grid-cols-5">
      {products.map((product, index) => (
        <CategoryProductCard
          key={product.id}
          product={product}
          activeVariantId={selectedVariants[String(product.id)]}
          getQuantity={getQuantity}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          changeVariant={changeVariant}
          priority={index === 0}
        />
      ))}
    </div>
  );
});

interface CategoryProductCardProps {
  product: Product;
  activeVariantId: number | undefined;
  getQuantity: (productId: number, variantId?: number) => number;
  incrementQuantity: (productId: number, variantId?: number) => void;
  decrementQuantity: (productId: number, variantId?: number) => void;
  changeVariant: (productId: number, variantId: number) => void;
  priority?: boolean;
}

function CategoryProductCard({
  product,
  activeVariantId,
  getQuantity,
  incrementQuantity,
  decrementQuantity,
  changeVariant,
  priority = false,
}: CategoryProductCardProps) {
  const hasVariants =
    product.variants !== undefined && product.variants.length > 0;
  // Resolve to first variant when none selected, so qty actions always
  // target a concrete variant.
  const resolvedVariantId = hasVariants
    ? (activeVariantId ?? product.variants?.[0]?.id)
    : undefined;

  const quantity = getQuantity(product.id, resolvedVariantId);

  // "Selected" tracks the whole card: true when ANY variant has qty > 0.
  const totalQuantity = hasVariants
    ? (product.variants ?? []).reduce(
        (sum, v) => sum + getQuantity(product.id, v.id),
        0,
      )
    : quantity;

  const handleIncrease = useCallback(() => {
    incrementQuantity(product.id, resolvedVariantId);
  }, [incrementQuantity, product.id, resolvedVariantId]);

  const handleDecrease = useCallback(() => {
    decrementQuantity(product.id, resolvedVariantId);
  }, [decrementQuantity, product.id, resolvedVariantId]);

  const handleVariantChange = useCallback(
    (variantId: number) => {
      changeVariant(product.id, variantId);
    },
    [changeVariant, product.id],
  );

  const getVariantQuantity = useCallback(
    (variantId: number) => getQuantity(product.id, variantId),
    [getQuantity, product.id],
  );

  // Pricing is read through helpers — components never touch
  // product.price / discount.* directly.
  const { currentPrice, compareAtPrice, discountAmount } = useMemo(
    () => ({
      currentPrice: getCurrentPrice(product),
      compareAtPrice: getCompareAtPrice(product),
      discountAmount: getDiscountAmount(product),
    }),
    [product],
  );

  return (
    <ProductCard
      badge={product.badge}
      discountAmount={discountAmount}
      image={product.image}
      title={product.title}
      description={product.description}
      variants={product.variants}
      selectedVariantId={resolvedVariantId}
      onVariantChange={handleVariantChange}
      getVariantQuantity={hasVariants ? getVariantQuantity : undefined}
      quantity={quantity}
      onIncrease={handleIncrease}
      onDecrease={handleDecrease}
      price={currentPrice}
      compareAtPrice={compareAtPrice}
      selected={totalQuantity > 0}
      priority={priority}
    />
  );
}
