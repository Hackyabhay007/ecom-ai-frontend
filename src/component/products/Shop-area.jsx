import React, { useState, useEffect, useMemo } from "react";
import Filter from "@/component/products/Filter";
import ProductCard from "@/component/products/ProductCard";
import Breadcrumb from "./Breadcrumb";
import GridLayout from "./GridLayout";
import SelectedFilters from "./SelectedFilters";
import ProductList from "./product_view/PageList";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { useRegion } from "../../contexts/RegionContext.jsx";
import { useRouter } from "next/router";
import { fetchcategores } from "../../../redux/slices/categorySlice";
import SkeletonScreen from "./Skeletonscreenshoparea";
import LineLoader from "../loader/LineLoader";

const ShopArea = () => {
  const dispatch = useDispatch();
  const { region } = useRegion();
  const router = useRouter();
  const { cat_id, size, color, min_price, max_price } = router.query;
  const [loading, setloading] = useState(false);

  const { products, count, nextPage, status, error } = useSelector(
    (state) => state.products
  );

  const { categories } = useSelector((state) => state.categorysection);
  // // console.log(category_id, "category_id");

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setloading(true);
      try {
        const queryParams = {
          limit: 12,
          fields:
            "*metadata,+options,-subtitle,-description,+images,+variants,+tag",
          category_id: cat_id,
        };

        let allProducts = [];
        let page = 1;

        // Helper function to calculate the discounted price for a variant
        const calculateDiscountedPrice = (variant, productMetadata) => {
          const discount = productMetadata?.discount || 0;
          const price =
            variant.calculated_price?.calculated_amount ||
            variant.original_price?.original_amount;

          if (!price) return 0; // No valid price, return 0
          return price && discount
            ? price - (price * discount) / 100
            : price
            ? price
            : 0;
        };

        function extractAndFormat(inputString) {
          // console.log("Raw inputString:", inputString);

          // Predefined valid size options
          const validSizes = ["xs", "s", "m", "l", "xl"];

          // Return null if inputString is invalid or not a string
          if (!inputString || typeof inputString !== "string") {
            console.warn("Invalid or non-string input:", inputString);
            return { size: null, color: null };
          }

          // Split the input string and trim whitespace
          const parts = inputString
            .split(" / ")
            .map((item) => item.trim().toLowerCase());
          // // console.log("Split parts:", parts);

          // Initialize size and color as null
          let size = null;
          let color = null;

          // Check each part to match valid sizes and determine color
          parts.forEach((part) => {
            if (validSizes.includes(part)) {
              size = part; // Match size from predefined options
            } else if (part.length >= 3) {
              color = part; // Assign color if it's a string of 3+ characters
            } else {
              console.warn("Unrecognized part:", part);
            }
          });

          const result = { size, color };
          // // console.log("Extracted result:", result);
          return result;
        }

        // Fetch products and filter
        while (allProducts.length < 10) {
          const response = await dispatch(
            fetchProducts({ pageParam: page, queryParams, region })
          ).unwrap();

          const filteredProducts = response.products

            .map((product) => {
              const validVariants = product.variants.filter((variant) => {
                const result = extractAndFormat(variant.title);
                // // console.log(extractAndFormat(variant.title) , result , "extractAndFormat(variant.title)" )

                const hasValidSize =
                  size && result?.size && result?.size.toLowerCase() == size.toLowerCase();

                const hasValidColor =
                  result.color && color
                    ? result?.color.toLowerCase() == color.toLowerCase()
                    : false;

                // // console.log(hasValidSize && hasValidColor ,"hasValidSize && hasValidColor" , product.title, variant)
                if (!hasValidColor) return hasValidSize;

                return hasValidSize && hasValidColor;
              });

              // If no size or color is provided, use the first variant
              const variantsToConsider =
                size || color ? validVariants : [product.variants[0]];

              // Filter variants by price
              const priceFilteredVariants = variantsToConsider.filter(
                (variant) => {
                  const discountedPrice = calculateDiscountedPrice(
                    variant,
                    product.metadata
                  );
                  return (
                    discountedPrice &&
                    (!min_price || discountedPrice > min_price) &&
                    (!max_price || discountedPrice < max_price)
                  );
                }
              );

              // Return the product with valid variants
              if (priceFilteredVariants.length > 0) {
                return { ...product, variants: priceFilteredVariants };
              }
              return null;
            })
            .filter((product) => product !== null); // Remove invalid products

          allProducts = [...allProducts, ...filteredProducts];
          setFilteredProducts(allProducts);

          // If fewer products are fetched and no more pages are left, break the loop
          if (response.products.length < 12) break;

          page++; // Increment the page for the next fetch
        }

        // Ensure not to fetch if products are less than 10 after all attempts
        if (allProducts.length >= 0) {
          dispatch({
            type: "SET_PRODUCTS",
            payload: allProducts.slice(0, 12), // Limit to 12 products
          });
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setloading(false); // Always set loading to false when done
      }
    };

    fetchFilteredProducts();
    dispatch(fetchcategores());
  }, [dispatch, cat_id, region, size, color, min_price, max_price]);

  // console.log(products, "from shop area");
  // console.log(categories, "categories");

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [heading, setHeading] = useState("Shop");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [layout, setLayout] = useState("grid");
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    price: [0, 1000],
    size: "",
    brand: [],
    color: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  }, [products, filteredProducts]);

  const clearFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(prev[key])
        ? prev[key].filter((item) => item !== value)
        : "",
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: "",
      price: [0, 1000],
      size: "",
      brand: [],
      color: "",
    });
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    setHeading(category.charAt(0).toUpperCase() + category.slice(1));
  };

  return (
    <div className="py-16 md:py-0 md:mb-5">
      {status === "loading" ||
        loading ||
        status === "failed" ||
        status == undefined ||
        (status == null && <SkeletonScreen />)}

      <Breadcrumb
        heading={heading}
        subCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        categories={categories}
      />

      <div className="flex flex-col md:flex-row gap-6 container mx-auto p-4">
        {/* Filter Section - Left Side on Desktop */}
        <div className="md:w-1/4 w-full">
          <Filter onApplyFilters={applyFilters} />
        </div>

        {/* Products Section - Right Side on Desktop */}
        <div className="md:w-3/4 w-full">
          <GridLayout
            onLayoutChange={setLayout}
            onSaleToggle={() => setShowSaleOnly(!showSaleOnly)}
            onSortChange={(e) => setSortBy(e.target.value)}
            currentLayout={layout}
            showSaleOnly={showSaleOnly}
          />

          <div className="text-left items-center flex gap-5 text-gray-600 my-4 mb-5">
            {status === "loading" && (
              <p>
                <LineLoader />
              </p>
            )}
            {status === "failed" && <p>Error: {error}</p>}
            {filteredProducts.length} Product
            {filteredProducts.length !== 1 ? "s" : ""} found
            <SelectedFilters
              filters={filters}
              onClearFilter={clearFilter}
              onClearAllFilters={clearAllFilters}
              defaultPriceRange={[0, 1000]}
            />
          </div>

          {status == "loading" && cat_id ? (
            <LineLoader />
          ) : (
            <ProductList
              products={filteredProducts}
              layout={layout}
              loading={loading && !filteredProducts.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopArea;
