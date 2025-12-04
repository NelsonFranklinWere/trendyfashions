import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon / header icon using site logo */}
        <link rel="icon" href="/images/logos/Logo.jpg" />
        <link rel="apple-touch-icon" href="/images/logos/Logo.jpg" />
        <link rel="shortcut icon" href="/images/logos/Logo.jpg" />
        <meta name="theme-color" content="#2c3e50" />
        <meta name="application-name" content="trendyfashionzone.co.ke" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

