import Cookies from 'js-cookie';

export const setCookie = (name, value, days = 1) => {
    Cookies.set(name, value, { expires: days });
};

export const getCookie = (name) => {
    return Cookies.get(name);
};

// console.log("This is the cookie", Cookies.get('auth_token'));

export const removeCookie = (name) => {
    Cookies.remove(name);
};

const VIEWED_PRODUCTS_KEY = 'viewed_products';
const COOKIE_EXPIRY = 7; // days

export const addViewedProduct = (product) => {
  try {
    const viewed = getViewedProducts();
    const updatedProducts = [product, ...viewed.filter(p => p.id !== product.id)].slice(0, 10);
    console.log('Updated products in cookie:', updatedProducts);
    
    Cookies.set(VIEWED_PRODUCTS_KEY, JSON.stringify(updatedProducts), { expires: COOKIE_EXPIRY });
  } catch (error) {
    console.error('Error saving viewed product:', error);
  }
};

export const getViewedProducts = () => {
  try {
    const viewed = Cookies.get(VIEWED_PRODUCTS_KEY);
    return viewed ? JSON.parse(viewed) : [];
  } catch (error) {
    console.error('Error getting viewed products:', error);
    return [];
  }
};
