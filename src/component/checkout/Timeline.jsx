import React from "react";

function Timeline({ step }) {
  // Steps configuration
  const steps = [
    { label: "Shipping", iconDefault: "ri-truck-line", iconCompleted: "ri-checkbox-circle-fill" },
    { label: "Review", iconDefault: "ri-box-1-line", iconCompleted: "ri-checkbox-circle-fill" },
    { label: "Payment", iconDefault: "ri-wallet-3-fill", iconCompleted: "ri-checkbox-circle-fill" },
  ];

  return (
    <div className="relative flex justify-between items-center w-full my-6">
      {/* Background line */}
      <div className="absolute top-1/3 left-0 w-full h-2 rounded-full border border-blue-950  -z-10"></div>

      {/* Progress line */}
      <div
    className="absolute top-1/3 left-0 h-2 max-w-80 md:max-w-6xl rounded-full border border-blue-950 bg-blue-800 -z-10 transition-all"
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
              className={` flex items-center justify-center rounded-full p-4 text-4xl md:text-7xl ${
                isCompleted ? "bg-blue-800 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              <i className={isCompleted ? s.iconCompleted : s.iconDefault}></i>
            </div>
            {/* Label */}
            <span className="text-sm text-gray-600">{s.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;