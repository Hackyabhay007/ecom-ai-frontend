import "../styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../redux/store"; // Adjust path based on your store location
import { RegionProvider } from "../contexts/RegionContext.jsx";
import { CartProvider } from "@/contexts/CartContext";
import { CryptoProvider } from "@/contexts/CryptoContext";
import WishlistSidebar from "@/component/wishlist/WishlistSidebar";
import Script from "next/script"; // Import the Script component
import "@fontsource/instrument-sans";

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
       
        <CryptoProvider>
          <RegionProvider>
            <CartProvider>
                <WishlistSidebar /> {/* Ensure the sidebar is always available */}
                <Component {...pageProps} />
            
            </CartProvider>
          </RegionProvider>
        </CryptoProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default MyApp;
