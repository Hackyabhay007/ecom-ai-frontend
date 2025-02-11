import { sdk } from "@/lib/config";
import { getCacheOptions } from "./cookies";

export const listCategories = async (query) => {
  const next = {
    ...(await getCacheOptions("categories")),
  };

  const limit = query?.limit || 100;

  return sdk.client
    .fetch("/store/product-categories", {
      query: {
        fields:
          "*category_children, *products, *parent_category, *parent_category.parent_category",
        limit,
        ...query,
      },
      next,
      cache: "force-cache",
    })
    .then(({ product_categories }) => product_categories);
};

export const getCategoryByHandle = async (categoryHandle) => {
  const handle = `${categoryHandle.join("/")}`;

  const next = {
    ...(await getCacheOptions("categories")),
  };

  return sdk.client
    .fetch(`/store/product-categories`, {
      query: {
        fields: "*category_children, *products",
        handle,
      },
      next,
      cache: "force-cache",
    })
    .then(({ product_categories }) => product_categories[0]);
};
