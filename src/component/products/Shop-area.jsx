import React, { useState, useEffect } from "react";
import Filter from "@/component/products/Filter";
import ProductCard from "@/component/products/ProductCard";
import Breadcrumb from "./Breadcrumb";
import GridLayout from "./GridLayout";
import SelectedFilters from "./SelectedFilters";
import ProductList from "./product_view/PageList";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/slices/productSlice";
import { useRegion } from "../../contexts/RegionContext.jsx";

const ShopArea = () => {
  const dispatch = useDispatch();
  const { region } = useRegion();

  const { products, count, nextPage, status, error } = useSelector(
    (state) => state.products
  );

  useEffect(()=>{
    const queryParams = { 
      limit: 12,
      fields: "*metadata,-options,-subtitle,-description,-images,+variants,+tag",

      // Add other query params as necessary
    };
    dispatch(fetchProducts({ pageParam: 1, queryParams, region }));
  },[dispatch])

  console.log(products , "from shop area")

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

  // useEffect(() => {
  //   dispatch(
  //     fetchProducts({
  //       pageParam: 1,
  //       queryParams: { limit: 12 },
  //     })
  //   );
  // }, [dispatch]);

  useEffect(() => {
    if (!products) return;
    let updatedProducts = products.filter((product) => {
      const matchesCategory =
        !filters.category || product.categories.includes(filters.category);
      const matchesPrice =
        product.price >= filters.price[0] && product.price <= filters.price[1];
      const matchesSize =
        !filters.size || product.categories.includes(filters.size);
      const matchesBrand =
        !filters.brand.length ||
        filters.brand.some((brand) =>
          product.name.toLowerCase().includes(brand.toLowerCase())
        );
      const matchesColor =
        !filters.color || product.name.toLowerCase().includes(filters.color);

      return (
        matchesCategory &&
        matchesPrice &&
        matchesSize &&
        matchesBrand &&
        matchesColor
      );
    });

    if (showSaleOnly) {
      updatedProducts = updatedProducts.filter((product) =>
        product.tags.includes("SALE")
      );
    }

    switch (sortBy) {
      case "low-to-high":
        updatedProducts.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        updatedProducts.sort((a, b) => b.price - a.price);
        break;
      case "best-discount":
        updatedProducts.sort((a, b) => b.discount - a.discount);
        break;
      default:
        break;
    }

    setFilteredProducts(products);
  }, [products, filters, showSaleOnly, sortBy]);

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
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error: {error}</p>}
      {status === "succeeded" && (
        <>
          <Breadcrumb
            heading={heading}
            subCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            categories={["T-Shirt", "Dress", "PartyWear", "Gown", "Swimwear"]}
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

              <div className="text-left items-center flex gap-5 text-gray-600 my-4 mb-5"> {status === "loading" && <p>Loading...</p>}
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

              <ProductList products={filteredProducts} layout={layout} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopArea;




  // const [products] = useState([
  //   {
  //     id: 1,
  //     name: "Ragian Full Sleeve T-Shirt",
  //     categories: ["clothing", "tshirt"],
  //     price: 100,
  //     prevPrice: 200,
  //     discount: 50,
  //     image: "/images/shop/shop1.jpeg",
  //     tags: ["NEW"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 2,
  //     name: "Kimano Sleeve Top",
  //     categories: ["clothing", "top"],
  //     price: 40,
  //     prevPrice: 60,
  //     discount: 33,
  //     image: "/images/shop/shop2.jpeg",
  //     tags: ["SALE"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 3,
  //     name: "Vintage Dress",
  //     categories: ["clothing", "dress","t-shirt"],
  //     price: 150,
  //     prevPrice: 250,
  //     discount: 40,
  //     image: "/images/shop/shop3.jpg",
  //     tags: ["NEW"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 4,
  //     name: "Floral Swimsuit",
  //     categories: ["clothing", "swimwear"],
  //     price: 75,
  //     prevPrice: 150,
  //     discount: 50,
  //     image: "/images/shop/shop4.jpeg",
  //     tags: ["SALE"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 5,
  //     name: "Partywear Sequin Dress",
  //     categories: ["clothing", "dress", "partywear"],
  //     price: 120,
  //     prevPrice: 240,
  //     discount: 50,
  //     image: "/images/shop/shop5.jpg",
  //     tags: ["NEW"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 6,
  //     name: "Casual T-shirt",
  //     categories: ["clothing", "tshirt"],
  //     price: 30,
  //     prevPrice: 60,
  //     discount: 50,
  //     image: "/images/shop/shop6.jpeg",
  //     tags: ["SALE"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 7,
  //     name: "Chic Party Dress",
  //     categories: ["clothing", "dress", "partywear"],
  //     price: 100,
  //     prevPrice: 200,
  //     discount: 50,
  //     image: "/images/shop/shop7.jpeg",
  //     tags: ["NEW"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 8,
  //     name: "Chic Party Dress",
  //     categories: ["clothing", "dress", "partywear"],
  //     price: 100,
  //     prevPrice: 200,
  //     discount: 50,
  //     image: "/images/shop/shop8.jpg",
  //     tags: ["SALE"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 9,
  //     name: "Chic Party Dress",
  //     categories: ["clothing", "dress", "partywear"],
  //     price: 100,
  //     prevPrice: 200,
  //     discount: 50,
  //     image: "/images/shop/shop9.jpg",
  //     tags: ["NEW"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  //   {
  //     id: 10,
  //     name: "Chic Party Dress",
  //     categories: ["clothing", "dress", "partywear"],
  //     price: 100,
  //     prevPrice: 200,
  //     discount: 50,
  //     image: "/images/shop/shop10.jpg",
  //     tags: ["NEW"],
  //     description:
  //       "Cable-knit with a soft blend of Italian wool and cashmere, this cardigan has a two-tone striped motif and a buttoned placket with scalloped edges. It's adorned with a signature Polo label on the sleeve.",
  //     additionalImages: [
  //       "/images/shop/additional1.jpg",
  //       "/images/shop/additional2.jpg",
  //     ],
  //     specifications: "Product specifications go here.",
  //     reviews: [
  //       { id: 1, rating: 5, text: "Amazing product!", image: "/review1.jpg" },
  //       { id: 2, rating: 4, text: "Good value for money.", image: "/review2.jpg" },
  //     ],
  //     size:["X","M","L","XL"],
  //       color:["pink","blue","cream","white"],
  //   },
  // ]);