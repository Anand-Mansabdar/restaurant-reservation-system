/**
 * Normalizes any date input to midnight UTC.
 * This is the key trick that makes "same date" comparisons a simple
 * equality check in MongoDB queries, instead of dealing with time-of-day
 * drift (e.g. "2026-07-20T14:30:00" vs "2026-07-20T00:00:00" being treated
 * as different dates when they shouldn't be).
 */
const normalizeDate = (dateInput) => {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    return null; // invalid date string
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
};

/**
 * Checks whether a normalized date is today or in the future (UTC).
 * Prevents customers from booking a table in the past.
 */
const isTodayOrFuture = (normalizedDate) => {
  const today = normalizeDate(new Date());
  return normalizedDate.getTime() >= today.getTime();
};

module.exports = { normalizeDate, isTodayOrFuture };
