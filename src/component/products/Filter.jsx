import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchcategores } from "../../../redux/slices/categorySlice";
import axios from "axios";
import { useRouter } from "next/router";

const Filter = ({ onApplyFilters }) => {
  const {
    categories: data,
    status,
    error,
  } = useSelector((state) => state.categorysection);
  const Route = useRouter();
    const { cat_id, cat_name, size : seleted_size, color: seleted_color } = Route.query; // Extract `id` from the query

  const [categroies, setCategroies] = useState([]);
  const dispatch = useDispatch();

  const getCountOfProductFromCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/category/get-cetegory-with-product-count`,
        {
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
          },
        }
      );
      const categories = response.data.categories;
      const updatedData = data.map((item) => {
        const matchingCategory = categories.find((cat) => cat.id === item.id);
        return matchingCategory
          ? { ...item, product_count: matchingCategory.product_count }
          : item;
      });
      setCategroies(updatedData);
    } catch (error) {
      console.error("Error fetching product counts for categories:", error);
    }
  };

  useEffect(() => {
    dispatch(fetchcategores());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      getCountOfProductFromCategory();
    }
  }, [data]);

  const [filters, setFilters] = useState({
    category: "",
    price: [0, 1000],
    size: "",
    brand: [],
    color: "",
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onApplyFilters(updatedFilters);
  };

  const updateQueryParams = (newParams) => {
    const currentQuery = Route.query;
    Route.push({
      pathname: "/shop",
      query: { ...currentQuery, ...newParams },
    });
  };

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileFilterOpen]);

  return (
    <div>
      <button
        className={`md:hidden w-full py-2 px-10 bg-white fixed z-40 text-end font-semibold rounded-md ${
          isMobileFilterOpen ? "top-5" : "top-60"
        }`}
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <p className="text-xl">
          <i className="ri-sound-module-line text-xl"></i> Filter
        </p>
      </button>

      <div
        className={`fixed inset-0 bg-white z-50 transform ${
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:static md:translate-x-0 md:block md:w-fit pb-10 md:pb-0`}
        style={{
          width: isMobileFilterOpen ? "80%" : "100%",
          height: "100%",
        }}
      >
        <div className="h-full overflow-y-auto p-4">
          <button
            className="md:hidden absolute top-4 bg-white right-4 text-black font-bold rounded-full p-[5px] px-[10px]"
            onClick={() => setIsMobileFilterOpen(false)}
          >
            ✕
          </button>

          <h2 className="text-md md:text-lg font-semibold mb-4 text-black">
            Filter
          </h2>

          <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Product Type</h3>
            <ul>
              {categroies.map((item) => (
                <li
                  key={item.name}
                  className={`flex py-1 justify-between text-sm cursor-pointer ${
                    cat_name === item.name
                      ? "text-theme-blue"
                      : "text-black"
                  }`}
                  onClick={() => {
                    updateQueryParams({ cat_id: item.id, cat_name: item.name });
                  }}
                >
                  <span className="capitalize">{item.name}</span>
                  <span>({item.product_count})</span>
                </li>
              ))}
            </ul>
            <hr className="my-4" />
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Size</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`p-[4px] px-[16px] text-xs border border-gray-900 rounded-sm ${
                    seleted_size === size
                      ? "bg-theme-blue text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => {
                    updateQueryParams({ size });
                    handleFilterChange("size", size);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
            <hr className="my-4" />
          </div>
           {/* Colors */}
           <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Colors</h3>
            <div className="flex flex-wrap gap-2">
              {["blue", "red", "yellow", "green", "black","White"].map((color) => (
                <div
                  key={color}
                  className={`flex items-center font-thin gap-2 border rounded-3xl py-1 px-1 pr-3 ${
                    color === seleted_color ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => updateQueryParams({ color: color })}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="w-4 h-4 rounded-2xl bg-zinc-900 border-2"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="capitalize text-xs text-cream">{color}</span>
                </div>
              ))}
            </div>
            <hr className="my-4" />
          </div>

          {/* Brand */}
          {/* <div className="mb-4">
            <h3 className="text-md font-semibold text-black mb-2">Brand</h3>
            <div className="flex flex-col gap-2">
              {[
                "Adidas",
                "Gucci",
                "Hermes",
                "Zara",
                "Nike",
                "LV",
                "Puma",
                "HM",
              ].map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={(e) => {
                      const selectedBrands = filters.brand || [];
                      if (e.target.checked) {
                        handleFilterChange("brand", [...selectedBrands, brand]);
                      } else {
                        handleFilterChange(
                          "brand",
                          selectedBrands.filter((b) => b !== brand)
                        );
                      }
                    }}
                    className="form-checkbox text-theme-blue accent-black"
                  />
                  <span className="text-black text-sm">{brand}</span>
                </label>
              ))}
            </div>
            <hr className="my-4" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Filter;
