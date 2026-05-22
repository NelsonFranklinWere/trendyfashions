'use client';

import Script from 'next/script';
import { analyticsConfig, isGoogleTagEnabled, isMetaPixelEnabled } from '@/lib/analytics/config';

/**
 * Meta Pixel + Google gtag (env-driven). Loaded once in _app.
 */
export default function AnalyticsScripts() {
  const { googleAdsId, googleAnalyticsId, metaPixelId } = analyticsConfig;
  const googleEnabled = isGoogleTagEnabled();
  const metaEnabled = isMetaPixelEnabled();

  if (!googleEnabled && !metaEnabled) return null;

  return (
    <>
      {googleEnabled && (
        <>
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ''}
              ${googleAnalyticsId ? `gtag('config', '${googleAnalyticsId}');` : ''}
            `}
          </Script>
          {googleAdsId && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
          )}
          {googleAnalyticsId && googleAnalyticsId !== googleAdsId && (
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
          )}
        </>
      )}

      {metaEnabled && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  );
}
