import { sdk } from "@/lib/config";
import medusaError from "@/lib/util/medusa-error";
import { getAuthHeaders, getCacheOptions } from "./cookies";

export const retrieveOrder = async (id) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.client
    .fetch(`/store/orders/${id}`, {
      method: "GET",
      query: {
        fields:
          "*payment_collections.payments,*items,*items.metadata,*items.variant,*items.product",
      },
      headers,
      next,
    })
    .then(({ order }) => {
      // console.log(order, "order");
      return order;
    })
    .catch((err) => medusaError(err));
};

export const listOrders = async (limit = 10, offset = 0, filters) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("orders")),
  };

  return sdk.client
    .fetch(`/store/orders`, {
      method: "GET",
      query: {
        limit,
        offset,
        order: "-created_at",
        fields: "*items,+items.metadata,*items.variant,*items.product",
        ...filters,
      },
      headers,
    })
    .then(({ orders }) => orders)
    .catch((err) => medusaError(err));
};

export const createTransferRequest = async (state, formData) => {
  const id = formData.get("order_id");

  if (!id) {
    return { success: false, error: "Order ID is required", order: null };
  }

  const headers = await getAuthHeaders();

  return await sdk.store.order
    .requestTransfer(
      id,
      {},
      {
        fields: "id, email",
      },
      headers
    )
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }));
};

export const acceptTransferRequest = async (id, token) => {
  const headers = await getAuthHeaders();

  return await sdk.store.order
    .acceptTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }));
};

export const declineTransferRequest = async (id, token) => {
  const headers = await getAuthHeaders();

  return await sdk.store.order
    .declineTransfer(id, { token }, {}, headers)
    .then(({ order }) => ({ success: true, error: null, order }))
    .catch((err) => ({ success: false, error: err.message, order: null }));
};
