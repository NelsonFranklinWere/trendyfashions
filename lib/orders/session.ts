const SESSION_KEY = 'tfz_order_session_id';

/** Stable browser session for grouping cart → checkout → payment attempts. */
export function getOrderSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return `sess_${Date.now()}`;
  }
}

export function setOrderSessionOrderId(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('tfz_order_session_order_id', orderId);
  } catch {
    // ignore
  }
}

export function getOrderSessionOrderId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('tfz_order_session_order_id');
  } catch {
    return null;
  }
}
