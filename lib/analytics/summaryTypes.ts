export type AnalyticsSummary = {
  liveVisitors: number;
  pageViewsToday: number;
  pageViews7d: number;
  productViewsToday: number;
  topProducts: Array<{
    productId: string;
    productName: string | null;
    views: number;
  }>;
  topPaths: Array<{ path: string; views: number }>;
  viewsLast24h: number;
};
