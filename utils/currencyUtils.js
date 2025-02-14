const USD_TO_INR_RATE = 83.12;

export const convertToINR = (usdPrice) => {
  if (!usdPrice) return 0;
  return Math.round(usdPrice * USD_TO_INR_RATE);
};

export const formatINR = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export const formatPriceToINR = (usdPrice) => {
  return formatINR(convertToINR(usdPrice));
};
