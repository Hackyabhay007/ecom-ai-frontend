import Cookies from 'js-cookie';

const VISITED_PRODUCTS_KEY = 'visited_products';
const MAX_VISITED_PRODUCTS = 20; // Limit the number of stored products

export const addVisitedProduct = (productId, authToken, guestId) => {
  try {
    // Get existing visited products
    let visitedProducts = JSON.parse(Cookies.get(VISITED_PRODUCTS_KEY) || '[]');

    // Check if product already exists
    const productExists = visitedProducts.some(product => product.productId === productId);

    if (!productExists) {
      // Add new product visit
      const newVisit = {
        productId,
        timestamp: new Date().toISOString(),
        authToken: authToken || null,
        guestId: guestId || null
      };

      // Add to beginning of array and maintain limit
      visitedProducts = [newVisit, ...visitedProducts].slice(0, MAX_VISITED_PRODUCTS);

      // Save back to cookie with 30-day expiry
      Cookies.set(VISITED_PRODUCTS_KEY, JSON.stringify(visitedProducts), { expires: 30 });
    }

    return visitedProducts;
  } catch (error) {
    console.error('Error adding visited product:', error);
    return [];
  }
};

export const getVisitedProducts = () => {
  try {
    return JSON.parse(Cookies.get(VISITED_PRODUCTS_KEY) || '[]');
  } catch (error) {
    console.error('Error getting visited products:', error);
    return [];
  }
};
