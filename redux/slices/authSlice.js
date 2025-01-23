import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sdk } from "@/lib/config";
import axios from "axios";
import { removeAuthToken, setAuthToken } from "@/lib/data/cookies";
import { getAuthHeaders } from "@/lib/data/cookies";

// Async Thunks
export const retrieveCustomer = createAsyncThunk(
  "customer/retrieve",
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders();
      console.log(headers);
      const response = await sdk.client.fetch("/store/customers/me", {
        method: "GET",
        query: { fields: "*orders" },
        headers,
      });
      return response.customer;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

export const createOrUpdateAddress = createAsyncThunk(
  "customer/createOrUpdateAddress",
  async ({ addressData }, { getState, rejectWithValue }) => {
    try {
      const { customer } = getState();
      const headers = await getAuthHeaders();
      console.log("hi");

      if (!customer.currentCustomer) {
        throw new Error("No customer data available");
      }

      const currentAddresses = customer.currentCustomer.addresses || [];

      console.log(currentAddresses, addressData);

      if (currentAddresses.length === 0) {
        const response = await sdk.store.customer
          .createAddress(addressData, {}, headers)
          .then(({ customer }) => {
            console.log(customer);
            retrieveCustomer()
          });
        console.log(response.address);
        return { type: "create", address: response.address };
      } else {
        const addressId = currentAddresses[0].id;
        const response = await sdk.store.address.update(
          addressId,
          addressData,
          {},
          headers
        );
        return { type: "update", address: response.address };
      }
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to create/update address"
      );
    }
  }
);

export const updateCustomer = createAsyncThunk(
  "customer/update",
  async (body, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders();
      const response = await sdk.store.customer.update(body, {}, headers);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCustomerPassword = createAsyncThunk(
    'customer/updatePassword',
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
      try {
        const response = await sdk.auth.resetPassword({
          currentPassword,
          newPassword
        });
        return response;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Password update failed');
      }
    }
  );

export const signup = createAsyncThunk(
  "customer/signup",
  async ({ formData, secretKey }, { rejectWithValue }) => {
    try {
      const { email, password, firstName, lastName, phone } = formData;

      // Register the customer
      const token = await sdk.auth.register("customer", "emailpass", {
        email,
        password,
      });

      await setAuthToken(token, secretKey);

      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
      const publishableApiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

      // Create customer
      const response = await axios.post(
        `${backendUrl}/store/customers`,
        {
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-publishable-api-key": publishableApiKey,
          },
        }
      );

      // Login customer
      const loginToken = await sdk.auth.login("customer", "emailpass", {
        email,
        password,
      });

      await setAuthToken(loginToken, secretKey);

      return { token: loginToken, customer: response.data };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const login = createAsyncThunk(
  "customer/login",
  async ({ formData, secretKey }, { rejectWithValue }) => {
    try {
      const { email, password } = formData;
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/auth/customer/emailpass`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data.token;
      await setAuthToken(token, secretKey);

      return { token };
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const signout = createAsyncThunk(
  "customer/signout",
  async (countryCode, { dispatch }) => {
    console.log("logout hit")
    await sdk.auth.logout();
    removeAuthToken();
    dispatch(authSlicer.actions.resetCustomer());
    return countryCode;
  }
);

// Slice

const authSlicer = createSlice({
  name: "customer",
  initialState: {
    currentCustomer: null,
    isLoading: false,
    error: null,
    token: null,
  },
  reducers: {
    resetCustomer: (state) => {
      state.currentCustomer = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Retrieve Customer
    builder.addCase(retrieveCustomer.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(retrieveCustomer.fulfilled, (state, action) => {
      state.currentCustomer = action.payload;
      state.isLoading = false;
    });
    builder.addCase(retrieveCustomer.rejected, (state) => {
      state.currentCustomer = null;
      state.isLoading = false;
    });

    // Update Customer
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.currentCustomer = action.payload;
    });

    // Signup
    builder.addCase(signup.fulfilled, (state, action) => {
      state.currentCustomer = action.payload.customer;
      state.token = action.payload.token;
    });

    // Login
    builder.addCase(login.fulfilled, (state, action) => {
      state.token = action.payload.token;
    });

    // Signout
    builder.addCase(signout.fulfilled, (state) => {
      state.currentCustomer = null;
      state.token = null;
    });

    // Create or Update Address
    builder.addCase(createOrUpdateAddress.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createOrUpdateAddress.fulfilled, (state, action) => {
      const { type, address } = action.payload;

      if (type === "create") {
        // Add new address
        state.currentCustomer.addresses = [
          ...(state.currentCustomer.addresses || []),
          address,
        ];
      } else {
        // Update existing address
        const index = state.currentCustomer.addresses.findIndex(
          (addr) => addr.id === address.id
        );
        if (index > -1) {
          state.currentCustomer.addresses[index] = address;
        }
      }

      state.isLoading = false;
    });
    builder.addCase(createOrUpdateAddress.rejected, (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    });
  },
});

export const { resetCustomer } = authSlicer.actions;
export default authSlicer.reducer;
