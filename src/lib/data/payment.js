"use server";
import { sdk } from "@/lib/config";
import { getAuthHeaders, getCacheOptions } from "./cookies";

export const listCartPaymentMethods = async (regionId) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("payment_providers")),
  };

  return sdk.client
    .fetch(`/store/payment-providers`, {
      method: "GET",
      query: { region_id: regionId },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ payment_providers }) =>{
      console.log(payment_providers)
      return payment_providers
    }
    )
    .catch(() => {
      return null;
    });
};
