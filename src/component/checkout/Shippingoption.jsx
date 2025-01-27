"use client";
import { RadioGroup, Radio } from "@headlessui/react";
import { setShippingMethod } from "@lib/data/cart";
import { calculatePriceForShippingOption } from "@lib/data/fulfillment";
import { convertToLocale } from "@lib/util/money";
import { CheckCircleSolid, Loader } from "@medusajs/icons";
import { Button, Heading, Text, clx } from "@medusajs/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";

const Shipping = ({ availableShippingMethods ,onPayment }) => {
  const { cart , updateCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [calculatedPricesMap, setCalculatedPricesMap] = useState({});
  const [error, setError] = useState(null);
  const [shippingMethodId, setShippingMethodId] = useState(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  );

  console.log(availableShippingMethods);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams.get("step") === "3";

  useEffect(() => {
    setIsLoadingPrices(true);

    if (availableShippingMethods?.length) {
      const promises = availableShippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id));

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap = {};
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount));

          setCalculatedPricesMap(pricesMap);
          setIsLoadingPrices(false);
        });
      }
    }
  }, [availableShippingMethods]);

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false });
  };

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false });
  };

  const handleSetShippingMethod = async (id) => {
    setError(null);
    let currentId = null;
    setIsLoading(true);
    setShippingMethodId((prev) => {
      currentId = prev;
      return id;
    });

    console.log(cart.id , id , " this is cart id and id");

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id } , updateCart)
      .catch((err) => {
        setShippingMethodId(currentId);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        sdvdsv
        <h2
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="green"
                strokeWidth="2"
              />
              <path d="M4 8l2 2l4 -4" stroke="green" strokeWidth="2" />
            </svg>
          )}
        </h2>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <span>
              <button
                onClick={handleEdit}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="edit-delivery-button"
              >
                Edit
              </button>
            </span>
          )}
      </div>
      {isOpen ? (
        <div data-testid="delivery-options-container">
          <div className="pb-8">
            <fieldset
              value={shippingMethodId}
              onChange={handleSetShippingMethod}
            >
              {availableShippingMethods?.map((option) => {
                const isDisabled =
                  option.price_type === "calculated" &&
                  !isLoadingPrices &&
                  typeof calculatedPricesMap[option.id] !== "number";

                console.log(availableShippingMethods);

                return (
                  <div
                    key={option.id}
                    className={`flex items-center justify-between text-sm cursor-pointer py-4 border rounded-lg px-8 mb-2 hover:shadow-md ${
                      option.id === shippingMethodId ? "border-blue-300" : ""
                    } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input
                      type="radio"
                      id={option.name}
                      name="shipping-method"
                      value={option.id}
                      disabled={isDisabled}
                      onChange={() => handleSetShippingMethod(option.id)}
                      className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex flex-col ml-4">
                      {/* Ensure label is associated with the input by using htmlFor */}
                      <label
                        htmlFor={option.name}
                        className="flex items-center gap-x-4 cursor-pointer"
                      >
                        <span className="text-base">{option.name}</span>
                      </label>
                      <span className="justify-self-end text-gray-700">
                        {option.price_type === "flat" ? (
                          convertToLocale({
                            amount: option.amount,
                            currency_code: cart?.currency_code,
                          })
                        ) : calculatedPricesMap[option.id] ? (
                          convertToLocale({
                            amount: calculatedPricesMap[option.id],
                            currency_code: cart?.currency_code,
                          })
                        ) : isLoadingPrices ? (
                          <Loader />
                        ) : (
                          "-"
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </fieldset>
          </div>

          <button
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            onClick={onPayment}
            disabled={!cart.shipping_methods?.[0]}
          >
            Continue to payment
          </button>
        </div>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-1/3">
                <span className="txt-medium-plus text-ui-fg-base mb-1">
                  Method
                </span>
                <span className="txt-medium text-ui-fg-subtle">
                  {cart.shipping_methods?.at(-1)?.name}{" "}
                  {convertToLocale({
                    amount: cart.shipping_methods.at(-1)?.amount,
                    currency_code: cart?.currency_code,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
