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

const ShopArea = () => {
  const dispatch = useDispatch();
  const { region } = useRegion();
  const router = useRouter();
  const { cat_id, size ,color } = router.query;
  const [loading, setloading] = useState(false);

  const { products, count, nextPage, status, error } = useSelector(
    (state) => state.products
  );

  const { categories } = useSelector((state) => state.categorysection);
  // console.log(category_id, "category_id");

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setloading(true);
  
      const queryParams = {
        limit: 12,
        fields:
          "*metadata,+options,-subtitle,-description,+images,+variants,+tag",
        category_id: cat_id,
      };
  
      let allProducts = [];
      let page = 1;
  
      // Fetch products until we have at least 10 valid products
      if (size || color) {
        while (allProducts.length < 10) {
          const response = await dispatch(
            fetchProducts({ pageParam: page, queryParams, region })
          ).unwrap(); // Assuming dispatch returns a Promise
  
          const filteredProducts = response.products.filter((product) => {
            // Check for size
            const hasValidSize = size
              ? product.options.some(
                  (option) =>
                    option.title === "Size" &&
                    option.values.some((value) => [size.toLowerCase()].includes(value.value.toLowerCase()))
                )
              : true;
  
            // Check for color
            const hasValidColor = color
              ? product.options.some(
                  (option) =>
                    option.title === "Color" &&
                    option.values.some((value) => [color.toLowerCase()].includes(value.value.toLowerCase()))
                )
              : true;

            console.log(hasValidColor,"hasValidColor")
            console.log(hasValidSize,"hasValidSize")
  
            return hasValidSize && hasValidColor;
          });
  
          allProducts = [...allProducts, ...filteredProducts];
          console.log(allProducts , "this was all products")
          setFilteredProducts(allProducts);
  
          // If products fetched are less than 12 and no more pages are left, break the loop
          if (response.products.length < 12) break;
  
          page++; // Increment the page for the next fetch
        }
      }
  
      // Ensure not to fetch if products are less than 10 after all attempts
      if (allProducts.length >= 10) {
        dispatch({
          type: "SET_PRODUCTS",
          payload: allProducts.slice(0, 12), // Limit to the required 12 products
        });
        setloading(false);
      }
    };
  
    fetchFilteredProducts();
    dispatch(fetchcategores());
  }, [dispatch, cat_id, region, size, color]); // Include color in dependency array
  

 

  console.log(products, "from shop area");
  console.log(categories, "categories");

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
  }, [products,filteredProducts]);


  

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
        (status == null  && <SkeletonScreen />)}
      {/* {status === "failed" && <p>Error: {error}</p>} */}
      
          <Breadcrumb
            heading={heading}
            subCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            categories={categories}
          />

          <div className="flex flex-col md:flex-row gap-6 container mx-auto p-4">
            <div className="w-full md:w-1/4">
              <Filter onApplyFilters={applyFilters} />
            </div>

            <div className="container mx-auto px-4">
              <GridLayout
                onLayoutChange={setLayout}
                onSaleToggle={() => setShowSaleOnly(!showSaleOnly)}
                onSortChange={(e) => setSortBy(e.target.value)}
                currentLayout={layout}
                showSaleOnly={showSaleOnly}
              />

              <div className="text-left items-center flex gap-5 text-gray-600 my-4 mb-5">
                {" "}
                {status === "loading" && <p>Loading...</p>}
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
                <p>loading ...</p>
              ) : (
                <ProductList products={filteredProducts} layout={layout} />
              )}
            </div>
          </div>
        
    </div>
  );
};

export default ShopArea;
