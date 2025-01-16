import React from "react";

function Timeline({ step }) {
  // Steps configuration
  const steps = [
    { label: "Shipping Address", iconDefault: "ri-truck-line", iconCompleted: "ri-checkbox-circle-fill" },
    { label: "Your Order", iconDefault: "ri-box-1-line", iconCompleted: "ri-checkbox-circle-fill" },
    { label: "Payment Method", iconDefault: "ri-wallet-3-fill", iconCompleted: "ri-checkbox-circle-fill" },
  ];

  return (
    <div className="relative flex justify-between items-center w-full my-6">
      {/* Background line */}
      <div className="absolute top-8 md:top-1/3 left-0 w-full h-1 rounded-full bg-gray-200  -z-10"></div>

      {/* Progress line */}
      <div
    className="absolute top-8 md:top-1/3 left-0 h-1 max-w-full md:max-w-full lg:max-w-full rounded-full border border-theme-blue bg-theme-blue -z-10 transition-all"
        style={{
          width: `${((step - 1) / (steps.length - 1)) * 100}%`,
        }}
      ></div>

      {/* Icons and labels */}
      {steps.map((s, index) => {
        const isCompleted = step > index + 1;
        return (
          <div key={index} className="flex flex-col items-center text-center space-y-2 z-10">
            {/* Icon */}
            <div
              className={` flex items-center justify-center rounded-full p-4 text-2xl md:text-4xl ${
                isCompleted ? "bg-theme-blue text-white " : "bg-white border text-sub-color"
              }`}
            >
              <i className={isCompleted ? s.iconCompleted : s.iconDefault}></i>
            </div>
            {/* Label */}
            <span className="text-theme-blue  font-bold">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;
