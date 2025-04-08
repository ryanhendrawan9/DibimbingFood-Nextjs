import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Dibimbing Food</title>
        <meta
          name="description"
          content="A food application built with Next.js"
        />
        <link
          rel="icon"
          href="https://learn.dibimbing.id/logo-dibimbing-blue-512.svg"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
