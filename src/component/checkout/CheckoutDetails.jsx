import React, { useEffect, useState } from "react";
import { setAddresses } from "@/lib/data/cart";
import { useRegion } from "@/contexts/RegionContext";
import { useCart } from "@/contexts/CartContext";
import { retrieveCustomer } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

function CheckoutDetails({ onContinue }) {
  const { cart, updateCart } = useCart();
  const { region } = useRegion();
  const { currentCustomer: user } = useSelector((state) => state.customer);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  // Initialize form data with empty values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address_2: "",
    landmark: "",
    state: "",
    pincode: "",
    phoneNumber: "",
    email: "",
    city: "",
    country: "India",
  });

  const [formErrors, setFormErrors] = useState({});

  // First, fetch the customer data
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        await dispatch(retrieveCustomer());
      } catch (error) {
        console.error("Error loading customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCustomerData();
  }, [dispatch]);

  console.log(user)

  // Update form data when cart or user changes
  useEffect(() => {
    if (!isLoading) {
      const userAddress = user?.addresses?.[0]; // Assuming we want the first address
      
      setFormData({
        firstName: cart?.shipping_address?.first_name || 
                  (userAddress?.first_name) || 
                  user?.first_name || 
                  "",
        lastName: cart?.shipping_address?.last_name || 
                 (userAddress?.last_name) || 
                 user?.last_name || 
                 "",
        address: cart?.shipping_address?.address_1 || 
                userAddress?.address_1 || 
                "",
        landmark: cart?.shipping_address?.address_2 || 
                  userAddress?.address_2 || 
                  "",
        state: cart?.shipping_address?.province || 
               userAddress?.province || 
               "",
        pincode: cart?.shipping_address?.postal_code || 
                userAddress?.postal_code || 
                "",
        phoneNumber: cart?.shipping_address?.phone || 
                    userAddress?.phone || 
                    user?.phone || 
                    "",
        email: cart?.email || user?.email || "",
        city: cart?.shipping_address?.city || 
              userAddress?.city || 
              "",
        country: "India",
      });
    }
  }, [cart, user, isLoading]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.landmark.trim()) errors.landmark = "Landmark is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone Number is required";

    return errors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      const formattedData = {
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          address_2: formData.landmark,
          postal_code: formData.pincode,
          city: formData.city,
          province: formData.state,
          country_code: "in",
          phone: formData.phoneNumber,
        },
        email: formData.email,
        same_as_billing: "on",
      };

      try {
        await setAddresses(
          null,
          formattedData,
          updateCart,
          process.env.NEXT_PUBLIC_REVALIDATE_SECRET
        );
        onContinue(formData);
      } catch (error) {
        console.error("Error setting addresses:", error);
      }
    } else {
      setFormErrors(errors);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[200px]">
      <p>Loading...</p>
    </div>;
  }

  return (
    <div className="flex flex-col w-full md:px-[10vw] p-4">
      <h2 className="text-xs border-b w-fit border-black md:text-sm text-center uppercase mb-5 text-black">
        Personal Details
      </h2>
      {/* Rest of your form JSX remains the same */}
      <form className="space-y-5 flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="border p-4 w-full text-xs sm:text-sm border-black"
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-xs sm:text-sm">
                {formErrors.firstName}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="border p-4 w-full text-xs sm:text-sm border-black"
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-xs sm:text-sm">
                {formErrors.lastName}
              </p>
            )}
          </div>
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="border p-4 w-full text-xs sm:text-sm border-black"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs sm:text-sm">{formErrors.email}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="border p-4 w-full text-xs sm:text-sm border-black"
          />
          {formErrors.address && (
            <p className="text-red-500 text-xs sm:text-sm">{formErrors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleInputChange}
              className="border p-4 w-full text-xs sm:text-sm border-black"
            />
            {formErrors.landmark && (
              <p className="text-red-500 text-xs sm:text-sm">
                {formErrors.landmark}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              className="border p-4 w-full text-xs sm:text-sm border-black"
            />
            {formErrors.state && (
              <p className="text-red-500 text-xs sm:text-sm">{formErrors.state}</p>
            )}
          </div>
          <div>
            <input
              type="number"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="border p-4 w-full text-xs sm:text-sm border-black"
            />
            {formErrors.pincode && (
              <p className="text-red-500 text-xs sm:text-sm">
                {formErrors.pincode}
              </p>
            )}
          </div>
        </div>

        <div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="border p-4 w-full text-xs sm:text-sm border-black"
          />
          {formErrors.phoneNumber && (
            <p className="text-red-500 text-xs sm:text-sm">
              {formErrors.phoneNumber}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-indigo-950 hover:bg-discount-color transition-all hover:text-black text-sm py-4 text-white hover:font-bold px-4 mt-auto w-full"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

export default CheckoutDetails;