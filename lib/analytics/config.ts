export const analyticsConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://trendyfashionzone.co.ke',
  currency: 'KES',
  googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17914939782',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-36T41E7M8B',
  metaPixelId:
    process.env.NEXT_PUBLIC_META_PIXEL_ID &&
    !process.env.NEXT_PUBLIC_META_PIXEL_ID.startsWith('your_')
      ? process.env.NEXT_PUBLIC_META_PIXEL_ID
      : '1853582855605497',
  metaCapiEnabled: Boolean(
    process.env.META_CAPI_ACCESS_TOKEN &&
      !String(process.env.META_CAPI_ACCESS_TOKEN).startsWith('your_') &&
      process.env.NEXT_PUBLIC_META_PIXEL_ID &&
      !String(process.env.NEXT_PUBLIC_META_PIXEL_ID).startsWith('your_'),
  ),
  metaCapiToken:
    process.env.META_CAPI_ACCESS_TOKEN &&
    !String(process.env.META_CAPI_ACCESS_TOKEN).startsWith('your_')
      ? process.env.META_CAPI_ACCESS_TOKEN
      : '',
  metaTestEventCode: process.env.META_TEST_EVENT_CODE || '',
  cronSecret: process.env.CRON_SECRET || '',
};

export function isMetaPixelEnabled(): boolean {
  return Boolean(analyticsConfig.metaPixelId && /^\d+$/.test(analyticsConfig.metaPixelId));
}

export function isGoogleTagEnabled(): boolean {
  return Boolean(analyticsConfig.googleAdsId || analyticsConfig.googleAnalyticsId);
}
