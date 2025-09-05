// pages/_app.js
import "@styles/globals.css"; // <- arquivo CSS comum (não module)
import { useRouter } from "next/router";
import Header from "@components/Header";
import Footer from "@components/Footer";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // Oculta a nav apenas no /simulador
  const showNav = router.pathname !== "/simulador";

  return (
    <>
      <Header showNav={showNav} />
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px" }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}
