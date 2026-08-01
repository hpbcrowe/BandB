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
