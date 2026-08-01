"use client";

import { formatDate, formatDateTime } from "@/utils/helpers";

/**
 * OrderStatusTimeline
 * @param {{ deliveryStatus: string, refunded: boolean, statusHistory?: Array<{status: string, changedAt: string|Date}> }} props
 * @returns
 * Renders a progress view for: Placed -> Processing -> Shipped -> Delivered.
 * If the order is cancelled or refunded, shows a distinct indicator instead
 * of a partial/broken progress bar.
 * When `statusHistory` entries are available, the date each status was
 * reached is shown under its step. Orders created before status history
 * tracking was added won't have entries for past steps, so no date is
 * shown in that case.
 */

const STEPS = [
  { key: "Not Processed", label: "Placed" },
  { key: "Processing", label: "Processing" },
  { key: "Shipped", label: "Shipped" },
  { key: "Delivered", label: "Delivered" },
];

// Finds the most recent history entry for a given status key, so that if a
// status was somehow reached more than once, the latest date is used.
const findStatusDate = (statusHistory, statusKey) => {
  if (!Array.isArray(statusHistory)) return null;
  const matches = statusHistory.filter((entry) => entry?.status === statusKey);
  if (matches.length === 0) return null;
  return matches[matches.length - 1].changedAt;
};

export default function OrderStatusTimeline({
  deliveryStatus,
  refunded,
  statusHistory,
}) {
  const isCancelledOrRefunded =
    refunded || deliveryStatus === "Cancelled" || deliveryStatus === "Refunded";

  if (isCancelledOrRefunded) {
    const bannerStatusKey =
      deliveryStatus === "Refunded" || refunded ? "Refunded" : "Cancelled";
    const bannerDate = findStatusDate(statusHistory, bannerStatusKey);

    return (
      <div className="alert alert-danger text-center mb-4" role="alert">
        {bannerStatusKey === "Refunded" ? "Order Refunded" : "Order Cancelled"}
        {bannerDate && (
          <div className="small mt-1">{formatDateTime(bannerDate)}</div>
        )}
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === deliveryStatus);

  return (
    <div className="d-flex justify-content-between mb-4">
      {STEPS.map((step, index) => {
        const isCompleted = currentIndex >= 0 && index <= currentIndex;
        const stepDate = isCompleted
          ? findStatusDate(statusHistory, step.key)
          : null;
        return (
          <div key={step.key} className="text-center flex-fill">
            <div
              className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                isCompleted
                  ? "bg-success text-white"
                  : "bg-secondary text-white"
              }`}
              style={{
                width: "32px",
                height: "32px",
                opacity: isCompleted ? 1 : 0.4,
              }}
            >
              {isCompleted ? "✓" : index + 1}
            </div>
            <small className={isCompleted ? "fw-bold" : "text-muted"}>
              {step.label}
            </small>
            {stepDate && (
              <div className="small text-muted">{formatDate(stepDate)}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
