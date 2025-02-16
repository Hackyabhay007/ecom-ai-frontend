import React, { useState, useEffect } from "react";
import Filter from "@/component/products/Filter";
import ProductCard from "@/component/products/ProductCard";
import Breadcrumb from "./Breadcrumb";
import GridLayout from "./GridLayout";
import SelectedFilters from "./SelectedFilters";
import ProductList from "./product_view/PageList";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setFilters, clearFilters, fetchProductsBySearch } from "../../../redux/slices/shopSlice";
import { useRegion } from "../../contexts/RegionContext.jsx";
import { useRouter } from "next/router";
// import { fetchcategores } from "../../../redux/slices/categorySlice";
import SkeletonScreen from "./Skeletonscreenshoparea";
import LineLoader from "../loader/LineLoader";

const ShopArea = () => {
  const dispatch = useDispatch();
  const { 
    products, 
    loading, 
    error, 
    filters: storeFilters, 
    meta 
  } = useSelector((state) => state.shop);

  console.log("This is the Products of the ShopArea", products);
  const { region } = useRegion();
  const router = useRouter();
  const { cat_id, size, color, min_price, max_price } = router.query;

  // Move state declarations before the useEffect
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [heading, setHeading] = useState("Shop");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [layout, setLayout] = useState("grid");
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Get categories from store filters
  const categories = storeFilters?.categories || [];

  // Load products when filters change
  useEffect(() => {
    if (!router.isReady) return;

    dispatch(fetchProducts({
      page: currentPage,
      filters: {
        categoryId: cat_id,
        size,
        color,
        minPrice: min_price,
        maxPrice: max_price,
        saleOnly: showSaleOnly // Add this line
      }
    }));
  }, [dispatch, currentPage, cat_id, size, color, min_price, max_price, showSaleOnly, router.isReady]); // Add showSaleOnly to dependencies

   const { appliedFilters } = useSelector(state => state.shop);

  // Update filtered products when products change
  useEffect(() => {
    if (products?.length > 0) {
      setFilteredProducts(products);
    }
  }, [products]);

  // Handle filter actions
  const clearFilter = (key, value) => {
    dispatch(setFilters({
      ...storeFilters,
      [key]: Array.isArray(storeFilters[key])
        ? storeFilters[key].filter((item) => item !== value)
        : ""
    }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    router.push('/shop');
  };

  const applyFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts({ page: 1, filters: newFilters }));
  };

  const handleCategorySelect = (category) => {
    dispatch(setFilters({ ...storeFilters, category }));
    setHeading(category.charAt(0).toUpperCase() + category.slice(1));
  };

  // Scroll to top when products update
  useEffect(() => {
    window.scrollTo({ top: 100, behavior: "smooth" });
  }, [products, filteredProducts]);

  // Handle individual filter clearing
  const handleClearFilter = (filterType, value) => {
    const newQuery = { ...router.query };
    
    switch (filterType) {
      case 'priceRange':
        delete newQuery.min_price;
        delete newQuery.max_price;
        break;
      case 'color':
        delete newQuery.color;
        break;
      case 'size':
        delete newQuery.size;
        break;
      case 'category':
        delete newQuery.cat_id;
        delete newQuery.cat_name;
        break;
      default:
        break;
    }

    // Update URL without the cleared filter
    router.push({
      pathname: '/shop',
      query: newQuery
    }, undefined, { shallow: true });

    // Update Redux store
    dispatch(setFilters({}));

    // Fetch products with updated filters
    dispatch(fetchProducts({
      page: 1,
      filters: {
        ...newQuery,
        categoryId: newQuery.cat_id,
        minPrice: newQuery.min_price,
        maxPrice: newQuery.max_price
      }
    }));
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    // Clear URL query params
    router.push('/shop', undefined, { shallow: true });

    // Clear filters in Redux store
    dispatch(clearFilters());

    // Fetch products without filters
    dispatch(fetchProducts({ page: 1, filters: {} }));
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Update the handleSaleToggle function
  const handleSaleToggle = () => {
    setShowSaleOnly(!showSaleOnly);

    const isChecked = showSaleOnly;
    // onSaleToggle(e); // Keep existing toggle behavior
    
    // Dispatch search with onSale parameter
    dispatch(fetchProductsBySearch({
      searchQuery: "",
      filters: {
        ...appliedFilters,
        onSale: isChecked
      }
    }));
  };

  const handleCollectionSelect = (collectionId) => {
    // Update applied filters with the selected collection
    dispatch(setFilters({
      ...appliedFilters,
      collections: collectionId
    }));

    // Fetch products with the selected collection
    dispatch(fetchProducts({
      page: 1,
      filters: {
        ...appliedFilters,
        collections: collectionId
      }
    }));

    // Update URL
    router.push({
      pathname: '/shop',
      query: {
        ...router.query,
        collection_id: collectionId
      }
    }, undefined, { shallow: true });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-16 md:py-0 md:mb-5">
      {loading && <SkeletonScreen />}

      <Breadcrumb
        heading={heading}
        onCollectionSelect={handleCollectionSelect}
        onClearAllFilters={handleClearAllFilters}
      />

      <div className="flex flex-col md:flex-row gap-6 container mx-auto p-4">
        {/* Filter Section - Left Side on Desktop */}
        <div className="md:w-1/4 w-full">
          <Filter 
            onApplyFilters={applyFilters}
            currentFilters={storeFilters || {
              categories: [],
              priceRange: { min: 0, max: 1000 },
              colors: [],
              sizes: []
            }}
          />
        </div>

        {/* Products Section - Right Side on Desktop */}
        <div className="md:w-3/4 w-full">
          <GridLayout 
            onLayoutChange={setLayout}
            onSaleToggle={handleSaleToggle}
            onSortChange={handleSortChange} // Updated: Pass the function directly
            currentLayout={layout}
            showSaleOnly={showSaleOnly}
            currentSort={sortBy} // Add this prop
          />

          <div className="text-left items-center flex gap-5 text-gray-600 my-4 mb-5">
            {loading && <LineLoader />}
            {error && <p>Error: {error}</p>}
            {products.length} Product
            {products.length !== 1 ? "s" : ""} found
            <SelectedFilters
              onClearFilter={handleClearFilter}
              onClearAllFilters={handleClearAllFilters}
              defaultPriceRange={[0, 1000]}
            />
          </div>

          {loading && cat_id ? (
            <LineLoader />
          ) : (
            <ProductList
              // products={products} // Use products directly from store
              layout={layout}
              // loading={loading}
              // onLayoutChange={setLayout} // Add this prop
              // currentSort={sortBy} // Add this prop
            />
          )}

          {/* {meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-theme-blue text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ShopArea;
