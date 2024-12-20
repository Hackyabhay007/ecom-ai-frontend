import "../styles/globals.css"; // Import the global styles here
import { AuthProvider } from "@/contexts/AuthContext";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../../redux/store"; // Adjust path based on where your store is located

function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider store={store}> 
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default MyApp;
