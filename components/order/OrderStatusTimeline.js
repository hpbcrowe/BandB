"use client";

/**
 * OrderStatusTimeline
 * @param {{ deliveryStatus: string, refunded: boolean }} props
 * @returns
 * Renders a progress view for: Placed -> Processing -> Shipped -> Delivered.
 * If the order is cancelled or refunded, shows a distinct indicator instead
 * of a partial/broken progress bar.
 */

const STEPS = [
  { key: "Not Processed", label: "Placed" },
  { key: "Processing", label: "Processing" },
  { key: "Shipped", label: "Shipped" },
  { key: "Delivered", label: "Delivered" },
];

export default function OrderStatusTimeline({ deliveryStatus, refunded }) {
  const isCancelledOrRefunded =
    refunded || deliveryStatus === "Cancelled" || deliveryStatus === "Refunded";

  if (isCancelledOrRefunded) {
    return (
      <div className="alert alert-danger text-center mb-4" role="alert">
        {deliveryStatus === "Refunded" || refunded
          ? "Order Refunded"
          : "Order Cancelled"}
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === deliveryStatus);

  return (
    <div className="d-flex justify-content-between mb-4">
      {STEPS.map((step, index) => {
        const isCompleted = currentIndex >= 0 && index <= currentIndex;
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
          </div>
        );
      })}
    </div>
  );
}
