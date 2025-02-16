// ...existing imports...

const Shop = () => {
  // ...existing code...

  const handleClearCollection = () => {
    router.push({
      pathname: "/shop",
      query: {} // Clear all query params
    }, undefined, { shallow: true });
    
    // Reset filters and fetch all products
    dispatch(fetchProductsBySearch({}));
  };

  return (
    <div>
      {/* ...existing code... */}
      <CollectionsSlider 
        collections={collections} 
        onCollectionSelect={handleCollectionSelect} 
        onClearCollection={handleClearCollection}
      />
      {/* ...rest of the component... */}
    </div>
  );
};

export default Shop;
