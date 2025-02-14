const USD_TO_INR_RATE = 83.12;

export const convertToINR = (usdPrice) => {
  if (!usdPrice) return 0;
  console.log("This is the modified INR Price", usdPrice*USD_TO_INR_RATE);
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

export const formatINR = (price) => {
    console.log('This is the price that applied', price);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const formatPriceToINR = (usdPrice) => {
  return formatINR(convertToINR(usdPrice));
};
