"use server";
import { sdk } from "@/lib/config";
import { getAuthHeaders, getCacheOptions } from "./cookies";

export const listCartShippingMethods = async (cartId) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("fulfillment")),
  };

  return sdk.client
    .fetch(`/store/shipping-options`, {
      method: "GET",
      query: { cart_id: cartId },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ shipping_options }) => shipping_options)
    .catch(() => {
      return null;
    });
};

export const calculatePriceForShippingOption = async (
  optionId,
  cartId,
  data
) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("fulfillment")),
  };

  const body = { cart_id: cartId, data };

  if (data) {
    body.data = data;
  }

  return sdk.client
    .fetch(`/store/shipping-options/${optionId}/calculate`, {
      method: "POST",
      body,
      headers,
      next,
    })
    .then(({ shipping_option }) => shipping_option)
    .catch((e) => {
      return null;
    });
};
