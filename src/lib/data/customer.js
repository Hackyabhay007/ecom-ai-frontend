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
  removeAuthToken,
  setAuthToken,
} from "./cookies";
import axios from "axios";
import Cookies from "js-cookie";

export const retrieveCustomer = async () => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const next = {
    ...(await getCacheOptions("customers")),
  };

  return await sdk.client
    .fetch(`/store/customers/me`, {
      method: "GET",
      query: {
        fields: "*orders",
      },
      headers,
      next,
      cache: "force-cache",
    })
    .then(({ customer }) => customer)
    .catch(() => null);
};

export const updateCustomer = async (body) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError);

  return updateRes;
};

export async function signup(_currentState, formData, secretKey) {
  const password = formData.password;
  const customerForm = {
    email: formData.email,
    first_name: formData.firstName,
    last_name: formData.lastName,
    phone: formData.phone,
  };

  console.log(customerForm);
  try {
    // Register the customer and fetch a token

    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    });

    console.log(token);
    await setAuthToken(token , secretKey);

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const publishableApiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    // Create the customer
    let createdCustomer;
    try {
      const response = await axios.post(
        `${backendUrl}/store/customers`,
        {
          email: customerForm.email,
          first_name: customerForm.first_name,
          last_name: customerForm.last_name,
          phone: customerForm.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-publishable-api-key": publishableApiKey,
          },
        }
      );
      createdCustomer = response.data; // Capture the response
    } catch (err) {
      console.error(
        "Error creating customer:",
        err.response?.data || err.message
      );
      return; // Exit the function if customer creation fails
    }

    // Log in the customer
    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    });

    await setAuthToken(loginToken , secretKey);


    await transferCart(loginToken );

    return loginToken; // Return the created customer data
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return error.toString();
  }
}

export async function login(_currentState, formData , secretKey) {
  const email = formData.email;
  const password = formData.password;
  let newtoken;

  // Create the customer
  let createdCustomer;

  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  // console.log(formData);

  const response = await axios
    .post(
      `${backendUrl}/auth/customer/emailpass`,
      {
        email: email,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      newtoken = res.data.token
    });

    // console.log(newtoken)
    await setAuthToken(newtoken , secretKey);

  try {
    await transferCart(newtoken);
  } catch (error) {
    return error.toString();
  }

  return newtoken;
}

export async function signout(countryCode) {
  await sdk.auth.logout();
  removeAuthToken();
  revalidateTag("auth");
  revalidateTag("customer");
  redirect(`/${countryCode}/account`);
}

export async function transferCart(token) {
  const cartId = await getCartId();

  if (!cartId) {
    return;
  }

  fetch(`https://api.themajesticpeacock.com/store/carts/${cartId}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then(({ cart }) => {
      // use cart...
      localStorage.setItem("_medusa_cart_data", JSON.stringify(cart));

      console.log(cart);
    });
}

export const addCustomerAddress = async (currentState, formData) => {
  const isDefaultBilling = currentState.isDefaultBilling || false;
  const isDefaultShipping = currentState.isDefaultShipping || false;

  const address = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    company: formData.get("company"),
    address_1: formData.get("address_1"),
    address_2: formData.get("address_2"),
    city: formData.get("city"),
    postal_code: formData.get("postal_code"),
    province: formData.get("province"),
    country_code: formData.get("country_code"),
    phone: formData.get("phone"),
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  };

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

export const deleteCustomerAddress = async (addressId) => {
  const headers = {
    ...(await getAuthHeaders()),
  };

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

export const updateCustomerAddress = async (currentState, formData) => {
  const addressId = currentState.addressId || formData.get("addressId");

  if (!addressId) {
    return { success: false, error: "Address ID is required" };
  }

  const address = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    company: formData.get("company"),
    address_1: formData.get("address_1"),
    address_2: formData.get("address_2"),
    city: formData.get("city"),
    postal_code: formData.get("postal_code"),
    province: formData.get("province"),
    country_code: formData.get("country_code"),
  };

  const phone = formData.get("phone");

  if (phone) {
    address.phone = phone;
  }

  const headers = {
    ...(await getAuthHeaders()),
  };

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers");
      revalidateTag(customerCacheTag);
      return { success: true, error: null };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};
