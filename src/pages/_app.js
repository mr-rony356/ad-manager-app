import "../styles/index.css";
import Footer from "@components/layout/Footer";
import NavBar from "@components/layout/NavBar";
import { ApiProvider } from "@contexts/APIContext";
import { appWithTranslation } from "next-i18next";
import reportWebVitals from "../reportWebVitals";

reportWebVitals();

function MyApp({ Component, pageProps }) {
  return (
    <ApiProvider>
      <NavBar user={pageProps.user} />
      <Component {...pageProps} />
      <Footer />
    </ApiProvider>
  );
}

export default appWithTranslation(MyApp);
