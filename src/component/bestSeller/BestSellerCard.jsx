import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRegion } from "../../contexts/RegionContext";

function BestSellerCard({ id, image, rating, price, prevPrice, discount, title }) {
  const { region } = useRegion();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [variantPrice, setVariantPrice] = useState(null);

  useEffect(() => {
    if (!region || !id) return;

    setLoading(true);
    const queryParams = new URLSearchParams({
      fields: `*variants.calculated_price`,
      region_id: region.id,
    });

    fetch(`http://localhost:9000/store/products/${id}?${queryParams.toString()}`, {
      credentials: "include",
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "temp",
      },
    })
      .then((res) => res.json())
      .then(({ product: dataProduct }) => {
        setProduct(dataProduct);

        // Find the variant with size 'M'
        const targetVariant = dataProduct.variants.find((variant) =>
          variant.options.some(
            (option) => option.value.toLowerCase() === "m" // Check if size is 'M'
          )
        );

        if (targetVariant) {
          setVariantPrice(
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: region.currency_code,
            }).format(targetVariant.calculated_price?.calculated_amount)
          );
        } else {
          setVariantPrice("N/A"); // Handle case where no variant matches
        }

        setLoading(false);
      });
  }, [id, region]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white border-2 border-theme-blue overflow-hidden rounded-lg shadow-lg my-5 flex flex-col">
      <Image
        src={image}
        alt={title}
        width={384}
        height={384}
        className="w-full h-96 object-cover mb-4"
      />
      <div className="flex flex-col p-4">
        <h2 className="font-bold">{title || "Clothing for men"}</h2>
        <span className="text-yellow-600 font-semibold mr-2">{rating} ★</span>
        <div className="flex flex-wrap gap-5 items-center">
          <span className="font-bold text-lg">
            {variantPrice !== "N/A" ? variantPrice : "Size M not available"}
          </span>
          {prevPrice && <span className="text-sub-color line-through">₹{prevPrice}</span>}
          {discount && (
            <span className="text-white bg-theme-blue rounded-full px-2 text-sm">
              - {discount}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BestSellerCard;
