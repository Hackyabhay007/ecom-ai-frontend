import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleProduct } from '../../../redux/slices/shopSlice';
import ProductView from '../../component/products/product_view/ProductView';
import Loader from '../../component/loader/Loader';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  
  const shop = useSelector((state) => state.shop);
  const { selectedProduct, selectedProductLoading, selectedProductError } = shop || {
    selectedProduct: null,
    selectedProductLoading: false,
    selectedProductError: null
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleProduct(id));
    }
  }, [dispatch, id]);

  if (!id) {
    return <Loader />;
  }

  if (selectedProductLoading) {
    return <Loader />;
  }

  if (selectedProductError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading product: {selectedProductError}
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Product not found</div> 
      </div>
    );
  }

  return <ProductView productId={id} />;
};

export default ProductPage;
