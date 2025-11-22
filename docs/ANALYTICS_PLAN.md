# Analytics & Telemetry Plan

## Event Overview

| Event | Trigger | Payload |
| --- | --- | --- |
| `tfz.cart.checkout` | User clicks **Order via WhatsApp** in the cart drawer | `{ itemCount, subtotal, currency, items[] }`
| `tfz.cart.continue` | User clicks **Continue Shopping** from the cart drawer | `{ itemCount, subtotal, currency, items[] }`
| `cart_checkout` (dataLayer) | Mirrors `tfz.cart.checkout` when `window.dataLayer` exists | Same as above |

## Implementation Notes

- Events are dispatched from `CartDrawer` using the `getCartAnalyticsPayload` helper in `lib/cart-utils.ts`.
- Consumers can subscribe to CustomEvents: `window.addEventListener('tfz.cart.checkout', handler)`.
- Google Tag Manager (or similar) can ingest the optional `dataLayer` push automatically.
- All monetary values use **KES** and contain raw numeric `subtotal` for downstream conversion.

## Future Enhancements

- Page view events can be emitted from page-level components with route metadata.
- Persist campaign attribution (UTM) in local storage and append to analytics payload.
- Introduce conversion tracking for completed WhatsApp orders once confirmed.


