import React, {useState} from "react";
import Image from "next/image";

function YourOrder({ order: initialOrder = [], onEdit, onPayment }) {
  const [order, setOrder] = useState(initialOrder);
  const calculateSubtotal = () => {
    return order
      .reduce((acc, item) => acc + item.quantity * parseFloat(item.price), 0)
      .toFixed(2);
  };
  const updateQuantity = (index, type) => {
    setOrder((prevOrder) =>
      prevOrder.map((item, i) => {
        if (i === index) {
          const newQuantity =
            type === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };
  return (
    <div>
      <div className="border border-black rounded-md">
      <div className="border border-black rounded-md ">
        {/* Header Section */}
        <div className="flex justify-between p-4 border-b border-black items-center mb-4">
          <div className="flex items-center">
            <i className="ri-truck-line text-theme-blue text-2xl mr-2"></i>
            <h2 className="text-xl font-bold text-theme-blue">Your Order</h2>
          </div>
          <button
            onClick={onEdit}
            className="text-theme-blue font-bold underline"
          >
            Edit
          </button>
        </div>

        {/* Table Section */}
        <div className="px-1 md:px-10">
          <table className="w-full text-left text-theme-blue">
            <thead>
              <tr className="font-semibold">
                <th>Your Product</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Saving</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.map((item, index) => (
                <tr
                  key={index}
                  className="border-b-2 border-dashed border-gray-600"
                >
                  <td className="py-4 pl-2 md:pl-0 flex flex-col items-start md:flex-row md:items-center">
                    <img
                      src={item.image}
                      alt="Product"
                      className="h-14 md:h-20 w-auto "
                    />
                    <div className="md:ml-4">
                      <h3 className="font-medium flex flex-wrap">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.color}</p>
                      <p className="text-sm text-gray-500">Size: {item.size}</p>
                    </div>
                  </td>
                  <td className="text-center">
                  <div className="flex items-center justify-center">
                      <button
                        className="px-2 bg-blue-500 text-white"
                        onClick={() => updateQuantity(index, "decrement")}
                      >
                        -
                      </button>
                      <span className="px-2 md:px-3">{item.quantity}</span>
                      <button
                        className="px-2 bg-blue-500 text-white"
                        onClick={() => updateQuantity(index, "increment")}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="text-red-500 font-semibold">
                      {item.discount|| 0}%
                    </span>
                    <div className="line-through text-gray-500">{item.prevPrice || ""}</div>
                  </td>
                  <td className="text-right">
                    <span className="text-gray-900 font-bold">₹{item.price}</span>
                  </td>
                </tr>
              ))}
        <div className="px-2 md:px-10">
          <table className=" w-full text-left text-theme-blue ">
            <thead>
              <tr className="font-semibold ">
                <th>Your Product</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Saving</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {/* Product Row */}
              <tr className="border-b-2 border-dashed border-gray-600 ">
                <td className="py-4 pl-2 md:pl-0 flex flex-col items-start md:flex-row md:items-center">
                  <Image
                    src={order.image}
                    alt="Product"
                    className="w-14 h-14 md:w-24 md:h-24 rounded-lg"
                  />
                  <div className="md:ml-4">
                    <h3 className="font-medium">{order.productName}</h3>
                    <p className="text-sm text-gray-500">{order.clothType}</p>
                    <p className="text-sm text-gray-500">Size: {order.size}</p>
                  </div>
                </td>
                <td className="text-center">
                  <div className="flex items-center justify-center">
                    <button className="px-2 bg-blue-500 text-white ">-</button>
                    <span className="px-2 md:px-3">{order.quantity}</span>
                    <button className="px-2 bg-blue-500 text-white ">+</button>
                  </div>
                </td>
                <td className="text-center">
                  <span className="text-red-500 font-semibold">
                    {order.discountPercentage}%
                  </span>
                  <div className="line-through text-gray-500">
                    {order.prevPrice}
                  </div>
                </td>
                <td className="text-right">
                  <span className="text-gray-900 font-bold">{order.price}</span>
                </td>
              </tr>

              {/* Subtotal and Shipping */}
              <tr>
                <td></td>
                <td></td>
                <td className="font-semibold text-theme-blue pt-1">Subtotal</td>
                <td className="text-right font-bold text-black">
                  ₹{calculateSubtotal()}
                </td>
              </tr>
              <tr className="border-b-2 border-dashed border-gray-600">
                <td></td>
                <td></td>
                <td className="font-semibold text-theme-blue py-2">Shipping</td>
                <td className="text-right font-bold text-black">
                  {order.length && order[0].shippingCharge === 0
                    ? "Free"
                    : `₹${order[0]?.shippingCharge || 0}`}
                </td>
              </tr>
              {/* Subtotal and Shipping */}
              <tr className="">
                <td></td>
                <td></td>
                <td className="font-semibold text-theme-blue pt-1">Subtotal</td>
                <td className="text-right font-bold text-black">
                  {order.subtotal}
                </td>
              </tr>
              <tr className="border-b-2 border-dashed border-gray-600 ">
                <td></td>
                <td></td>
                <td className="font-semibold text-theme-blue py-2">Shipping</td>
                <td className="text-right font-bold text-black">
                  {order.shippingCharge === 0
                    ? "Free"
                    : `₹${order.shippingCharge}`}
                </td>
              </tr>

              {/* Discount Coupon and Total */}
              <tr>
                <td className="font-semibold text-theme-blue py-2">Discount Coupon?</td>
                <td></td>
                <td className="font-semibold text-theme-blue py-2">Total</td>
                <td className="text-right font-bold text-black">
                  ₹{calculateSubtotal()}
                </td>
              </tr>
            </tbody>
          </table>
          </div>
              {/* Discount Coupon and Total */}
              <tr>
                <td className="font-semibold text-theme-blue py-2">
                  Discount Coupon?
                </td>
                <td></td>
                <td className="font-semibold text-theme-blue py-2">Total</td>
                <td className="text-right font-bold text-black">
                  {order.total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Loyalty and Points Section */}
      <div className="bg-blue-100 p-6 rounded-md mt-6">
        <h3 className="text-theme-blue text-lg font-semibold border-b-2 pb-1 mb-2 w-fit border-theme-blue">
          The Majestic Peacock Loyalty & Points
        </h3>
        <ul className="list-decimal pl-5 space-y-2">
          <li>
            Rewards: Customers can earn points or rewards that can be redeemed
            for discounts, free products, or other benefits.
            Rewards: Customers can earn points or rewards that can be redeemed
            for discounts, free products, or other benefits.
          </li>
          <li>
            Exclusive access: Customers may get early access to new collections,
            sale events, or exclusive product launches.
            Exclusive access: Customers may get early access to new collections,
            sale events, or exclusive product launches.
          </li>
          <li>
            Personalized offers: Customers may receive personalized offers based
            on their purchase history and preferences.
            Personalized offers: Customers may receive personalized offers based
            on their purchase history and preferences.
          </li>
          <li>
            Community engagement: Customers may be invited to members-only
            events, forums, or social media groups.
            Community engagement: Customers may be invited to members-only
            events, forums, or social media groups.
          </li>
        </ul>
      </div>

      {/* Continue Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onPayment}
          className="bg-theme-blue text-white py-2 px-4 rounded-md w-full"
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  );
}

export default YourOrder;
