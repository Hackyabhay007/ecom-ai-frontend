import { Provider } from 'react-redux';
import { store } from '../redux/store';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      {/* ...other providers... */}
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
