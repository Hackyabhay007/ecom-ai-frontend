import "../styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../redux/store"; // Adjust path based on your store location
import { RegionProvider } from "../contexts/RegionContext.jsx";
import { CartProvider } from "@/contexts/CartContext";
import { CryptoProvider } from "@/contexts/CryptoContext";
// import { getBaseURL } from "../lib/util/env";

// export const metadata = {
//   metadataBase: new URL(getBaseURL()),
// };

import WishlistSidebar from "@/component/wishlist/WishlistSidebar";
import "@fontsource/instrument-sans";
function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CryptoProvider>
          <RegionProvider>
            <CartProvider>
              <AuthProvider>
                <WishlistSidebar />{" "}
                {/* Ensure the sidebar is always available */}
                <Component {...pageProps} />
              </AuthProvider>
            </CartProvider>
          </RegionProvider>
        </CryptoProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default MyApp;
