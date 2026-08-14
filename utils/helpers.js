export function calculateAverageRating(ratings) {
  let totalRating = 0;
  for (const ratingObj of ratings) {
    totalRating += ratingObj.rating;
  }
  const averageRating = totalRating / ratings.length;
  return averageRating;
}

/**
 * Formats a date deterministically using a fixed locale and time zone so the
 * server-rendered and client-rendered output always match exactly. Using the
 * runtime's default locale/time zone (e.g. bare `toLocaleDateString()`) can
 * differ between the server environment and the user's browser, which causes
 * React hydration mismatches.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Same as formatDate, but also includes the time. See formatDate for why a
 * fixed locale/time zone is used.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function formatOrderTotal(order) {
  const rawAmount = Number(
    order?.amount_captured ?? order?.amount_received ?? order?.total ?? NaN,
  );

  if (!Number.isFinite(rawAmount)) {
    return "N/A";
  }

  const currency = (order?.currency || "usd").toUpperCase();
  return `$${(rawAmount / 100).toFixed(2)} ${currency}`;
}

export function getPaymentStatusLabel(order) {
  const paymentStatus = String(order?.payment_status || order?.status || "")
    .trim()
    .toLowerCase();

  if (order?.refunded || paymentStatus === "refunded") {
    return "Refunded";
  }

  if (
    order?.delivery_status === "Cancelled" ||
    paymentStatus === "cancelled" ||
    paymentStatus === "canceled"
  ) {
    return "Cancelled";
  }

  if (
    paymentStatus === "pending" ||
    paymentStatus === "processing" ||
    paymentStatus === "requires_action" ||
    paymentStatus === "requires_capture"
  ) {
    return "Pending";
  }

  if (paymentStatus === "failed") {
    return "Failed";
  }

  if (
    paymentStatus === "succeeded" ||
    paymentStatus === "paid" ||
    Number(order?.amount_captured ?? order?.amount_received ?? 0) > 0
  ) {
    return "Paid";
  }

  return "Unknown";
}
