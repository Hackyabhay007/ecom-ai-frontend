// hooks/useProducts.js
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { useRegion } from "./RegionContext";

const useProducts = () => {
  const dispatch = useDispatch();
  const { region } = useRegion();
  const { products, count, nextPage, status, error } = useSelector(
    (state) => state.products
  );

  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchProducts({ pageParam: 1, queryParams: {}, region }))
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        setErrorState(err.message || "Something went wrong");
      });
  }, [dispatch, region]);

  return { products, count, nextPage, status, error, loading, errorState };
};

export default useProducts;
