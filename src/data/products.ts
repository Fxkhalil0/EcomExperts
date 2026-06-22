// Local product catalog grouped by category. Read pricing through
// helpers/pricing.helper.ts \u2014 never touch `price`/`discount.*` directly.

import type {
  BundleConfiguration,
  CategoryDescriptor,
  ProductCatalog,
} from "@/types";

// Re-exported for back-compat; new code should import from `@/types`.
export type {
  Category,
  Product,
  ProductCatalog,
  ProductDiscount,
  ProductVariant,
} from "@/types";

export const categories: CategoryDescriptor[] = [
  { id: "cameras", label: "Choose your cameras" },
  { id: "plans", label: "Choose your plan" },
  { id: "sensors", label: "Choose your sensors" },
  { id: "accessories", label: "Choose your protection" },
];

export const productCatalog: ProductCatalog = {
  // ---------- Cameras ----------
  cameras: [
    {
      id: 1,
      title: "Indoor Cam Pro",
      description:
        "1080p HD indoor camera with night vision and two-way audio.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/7377c4c026acb3c476e41ccec1e0376490ee2cb9_o9rdf1.png",
      badge: "Best Seller",
      discount: { amount: 20, priceBefore: 9900, priceAfter: 7900 },
      variants: [
        {
          id: 101,
          name: "White",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/7377c4c026acb3c476e41ccec1e0376490ee2cb9_o9rdf1.png",
        },
        {
          id: 102,
          name: "Grey",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/7377c4c026acb3c476e41ccec1e0376490ee2cb9_o9rdf1.png",
        },
        {
          id: 103,
          name: "Black",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/7377c4c026acb3c476e41ccec1e0376490ee2cb9_o9rdf1.png",
        },
      ],
    },
    {
      id: 2,
      title: "Outdoor Cam 4K",
      description:
        "Weatherproof 4K outdoor camera with color night vision and spotlight.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 17, priceBefore: 17900, priceAfter: 14900 },
      variants: [
        {
          id: 201,
          name: "White",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
        {
          id: 202,
          name: "Graphite",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
      ],
    },
    {
      id: 3,
      title: "Video Doorbell",
      description:
        "Smart doorbell with motion alerts, 2K video, and live two-way talk.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899569/image_16_pzkz0s.svg",
      badge: "New",
      price: 12900,
    },
    {
      id: 4,
      title: "Video Doorbell",
      description:
        "Smart doorbell with motion alerts, 2K video, and live two-way talk.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899569/image_110_fc7xni.svg",
      badge: "New",
      price: 12900,
    },
    {
      id: 5,
      title: "Video Doorbell",
      description:
        "Smart doorbell with motion alerts, 2K video, and live two-way talk.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899569/image_112_qivrgz.svg",
      badge: "New",
      price: 12900,
    },
  ],

  // ---------- Plans ----------
  plans: [
    {
      id: 6,
      title: "Basic Plan",
      description: "7-day cloud video history for 1 device. Cancel anytime.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 29, priceBefore: 699, priceAfter: 499 },
    },
    {
      id: 7,
      title: "Standard Plan",
      description:
        "30-day cloud history, person & package alerts for unlimited devices.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      badge: "Most Popular",
      discount: { amount: 23, priceBefore: 1299, priceAfter: 999 },
    },
    {
      id: 8,
      title: "Premium Plan",
      description:
        "60-day history, 24/7 professional monitoring, and cellular backup.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 20, priceBefore: 2499, priceAfter: 1999 },
    },
  ],

  // ---------- Sensors ----------
  sensors: [
    {
      id: 9,
      title: "Motion Sensor",
      description:
        "Wireless PIR motion sensor with 2-year battery life and pet immunity.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 26, priceBefore: 3900, priceAfter: 2900 },
    },
    {
      id: 10,
      title: "Door & Window Sensor",
      description:
        "Compact magnetic contact sensor for entry points. Easy peel-and-stick install.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 24, priceBefore: 2500, priceAfter: 1900 },
      variants: [
        {
          id: 801,
          name: "Single Pack",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
        {
          id: 802,
          name: "3-Pack",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
        {
          id: 803,
          name: "5-Pack",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
      ],
    },
    {
      id: 11,
      title: "Glass Break Sensor",
      description: "Detects the sound of breaking glass within a 25 ft radius.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 20, priceBefore: 4900, priceAfter: 3900 },
    },
    {
      id: 12,
      title: "Smoke & CO Detector",
      description:
        "Combination smoke and carbon monoxide detector with phone alerts.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      badge: "Recommended",
      discount: { amount: 25, priceBefore: 7900, priceAfter: 5900 },
    },
  ],

  // ---------- Accessories ----------
  accessories: [
    {
      id: 13,
      title: "Solar Panel",
      description:
        "Continuous solar charging for outdoor cameras. 6 ft weatherproof cable.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      price: 4900,
      variants: [
        {
          id: 1101,
          name: "Black",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
        {
          id: 1102,
          name: "White",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
      ],
    },
    {
      id: 14,
      title: "Mounting Kit",
      description:
        "Universal wall and ceiling mounting kit with adjustable swivel head.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      price: 1500,
    },
    {
      id: 15,
      title: "Extension Power Cable",
      description:
        "Weather-resistant extension cable for outdoor cameras and doorbells.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 24, priceBefore: 2500, priceAfter: 1900 },
      variants: [
        {
          id: 1301,
          name: "10 ft",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
        {
          id: 1302,
          name: "25 ft",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
        {
          id: 1303,
          name: "50 ft",
          thumbnail:
            "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
        },
      ],
    },
    {
      id: 16,
      title: "Backup Battery Pack",
      description:
        "Rechargeable battery pack that keeps your hub online during outages.",
      image:
        "https://res.cloudinary.com/du1kw6s2g/image/upload/v1781899570/image_13_ejf6ss.svg",
      discount: { amount: 20, priceBefore: 4900, priceAfter: 3900 },
    },
  ],
};

/**
 * Starter bundle loaded the first time the app runs (no saved
 * configuration in localStorage). Covers selected products, selected
 * variants, and quantities in one persistable snapshot.
 */
export const defaultConfiguration: BundleConfiguration = {
  selectedVariants: { 1: 101, 2: 202 },
  quantities: {
    "1::101": 1,
    "2::202": 1,
    "7::_default": 1,
    "12::_default": 1,
    "14::_default": 1,
  },
};
