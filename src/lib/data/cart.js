"use server";

import { sdk } from "@/lib/config";
import medusaError from "@/lib/util/medusa-error";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies";
import { getRegion } from "./regions";
import { useCart } from "@/contexts/CartContext";

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */

export async function retrieveCart(cartId) {
  const id = cartId || (await getCartId());

  if (!id) {
    return null;
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("carts")),
  };

  return await sdk.client
    .fetch(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
      },
      headers,
      next,
    })
    .then(({ cart }) => cart)
    .catch(() => null);
}

export async function getOrSetCart(region) {
  if (!region) {
    throw new Error(
      `Region not found for country code: ${region.currency_code}`
    );
  }

  let cart = await retrieveCart();

  const headers = {
    ...(await getAuthHeaders()),
  };

  // console.log("cart function is run");
  if (!cart) {
    // console.log("cart function is craaete cart");

    const cartResp = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    );
    cart = cartResp.cart;

    await setCartId(cart.id);

    // const cartCacheTag = await getCacheTag("carts");
    // revalidateTag(cartCacheTag);
  }

  if (cart && cart?.region_id !== region.id) {
    // console.log("cart function is run");

    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers);
    // const cartCacheTag = await getCacheTag("carts");
    // revalidateTag(cartCacheTag);
  }

  return cart;
}

export async function updateCart(data , Updater) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error(
      "No existing cart found, please create one before updating"
    );
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }) => {
      console.log(cart)
      localStorage.setItem("_medusa_cart_data" , JSON.stringify(cart))
      Updater(cart)
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag);
      return cart;
    })
    .catch(medusaError);
}

export async function addToCart({ variantId, quantity, region, Updater }) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart");
  }

  const cart = await getOrSetCart(region);

  if (!cart) {
    throw new Error("Error retrieving or creating cart");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .then(async (res) => {
      localStorage.setItem("_medusa_cart_data", JSON.stringify(res.cart));
      // console.log(res);
      Updater(res.cart);
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag)
    })
    .catch(medusaError);
}

export async function updateLineItem({ lineId, quantity }) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item");
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async (data) => {
      // const cartCacheTag = await getCacheTag("carts");
      // console.log(data.cart.items);
      localStorage.setItem("_medusa_cart_data", JSON.stringify(data.cart));
      // revalidateTag(cartCacheTag);
    })
    .catch(medusaError);
}

export async function deleteLineItem(lineId) {
  // console.log(lineId);
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item");
  }

  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, headers)
    .then(async (res) => {
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag);
      localStorage.setItem("_medusa_cart_data", JSON.stringify(res.parent));
      // console.log(res);
    })
    .catch(medusaError);
}

export async function setShippingMethod({ cartId, shippingMethodId }) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag);
    })
    .catch(medusaError);
}

export async function initiatePaymentSession(cart, data) {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag);
      return resp;
    })
    .catch(medusaError);
}

export async function applyPromotions(codes) {
  const cartId = await getCartId();

  if (!cartId) {
    throw new Error("No existing cart found");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag);
    })
    .catch(medusaError);
}

export async function applyGiftCard(code) {
    const cartId = getCartId()
    if (!cartId) return "No cartId cookie found"
    try {
      await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
        revalidateTag("cart")
      })
    } catch (error) {
      throw error
    }
}

export async function removeDiscount(code) {
  const cartId = getCartId()
  if (!cartId) return "No cartId cookie found"
  try {
    await deleteDiscount(cartId, code)
    
  } catch (error) {
    throw error
  }
}

export async function removeGiftCard(
  codeToRemove,
  giftCards,
) {
    const cartId = getCartId()
    if (!cartId) return "No cartId cookie found"
    try {
      await updateCart(cartId, {
        gift_cards: [...giftCards]
          .filter((gc) => gc.code !== codeToRemove)
          .map((gc) => ({ code: gc.code })),
      }).then(() => {
        revalidateTag("cart")
      })
    } catch (error) {
      throw error
    }
}

export async function submitPromotionForm(currentState, formData) {
  const code = ("formData.code");
  try {
    await applyPromotions([code]);
  } catch (e) {
    return e.message;
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState, formData , Updater) {
  console.log(4);
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses");
    }
    const cartId = getCartId();
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses");
    }
    console.log(5);

    const data = {
      shipping_address: {
        first_name: formData.shipping_address.first_name,
        last_name: formData.shipping_address.last_name,
        address_1: formData.shipping_address.address_1,
        address_2: "",
        company: formData.shipping_address.company,
        postal_code: formData.shipping_address.postal_code,
        city: formData.shipping_address.city,
        country_code: formData.shipping_address.country_code,
        province: formData.shipping_address.province,
        phone: formData.shipping_address.phone,
      },

      email: "kansihk21soni@gmail.com",
    };

    console.log(6, data);
    const sameAsBilling = formData.same_as_billing;
    if (sameAsBilling === "on") data.billing_address = data.shipping_address;

  

    console.log(7 , data);
    await updateCart(data ,Updater);
  } catch (e) {
    return e.message;
  }

  // redirect(
  //   `/${formData.shipping_address.country_code}/checkout?step=delivery`
  // );
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId) {
  const id = cartId || (await getCartId());

  if (!id) {
    throw new Error("No existing cart found when placing an order");
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  const cartRes = await sdk.store.cart
    .complete(id, {}, headers)
    .then(async (cartRes) => {
      // const cartCacheTag = await getCacheTag("carts");
      // revalidateTag(cartCacheTag);
      return cartRes;
    })
    .catch(medusaError);

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase();
    removeCartId();
    redirect(`/${countryCode}/order/${cartRes?.order.id}/confirmed`);
  }

  return cartRes.cart;
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode, currentPath) {
  const cartId = await getCartId();
  const region = await getRegion(countryCode);

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`);
  }

  if (cartId) {
    await updateCart({ region_id: region.id });
    // const cartCacheTag = await getCacheTag("carts");
    // revalidateTag(cartCacheTag);
  }

  const regionCacheTag = await getCacheTag("regions");
  revalidateTag(regionCacheTag);

  const productsCacheTag = await getCacheTag("products");
  revalidateTag(productsCacheTag);

  redirect(`/${countryCode}${currentPath}`);
}

export async function listCartOptions() {
  const cartId = await getCartId();
  const headers = {
    ...(await getAuthHeaders()),
  };
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  };

  return await sdk.client.fetch("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
  });
}
