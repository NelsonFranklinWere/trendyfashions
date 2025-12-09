import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import Head from 'next/head';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import WhatsAppFloatButton from '@/components/WhatsAppFloatButton';

export default function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        {/* Preload critical fonts for faster rendering */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <CartProvider>
      <Navbar />
      <main className="min-h-screen pt-16 md:pt-20">
        <Component {...pageProps} />
      </main>
      <WhatsAppFloatButton />
      <Footer />
    </CartProvider>
    </>
  );
}

