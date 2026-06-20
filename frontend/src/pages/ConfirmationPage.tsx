import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { BACKEND_URL } from "../config";

export default function ConfirmationPage({ orderId, onNavigate }: { orderId: string | null; onNavigate: PageNavigator }) {
  const { clearCart } = useCart();
  const [status, setStatus] = useState("processing");
  const [_, setAttempts] = useState(0);

  useEffect(() => {
    if (!orderId) return;

    clearCart();

    // Poll the backend for the order status until it's paid or failed
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}`);
        const data = await res.json();

        if (data.paymentStatus === "success" || data.paymentStatus === "failed") {
          setStatus(data.paymentStatus);
          clearInterval(interval);
        } else {
          setAttempts((a) => a + 1);
        }
      } catch {
        setAttempts((a) => a + 1);
      }
    }, 1000);

    // Stop polling after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setStatus("timeout");
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId]);

  if (status === "processing") {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-dark mb-4"
          role="status"
          style={{ width: 48, height: 48 }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="fw-bold">Processing your payment</h2>
        <p className="text-muted">
          Please wait while we confirm your order...
        </p>
        <p
          className="text-muted small"
          data-status="processing"
        >
          processing
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="container py-5 text-center">
        <div
          className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-4"
          style={{ width: 80, height: 80 }}
        >
          <i className="bi bi-check-lg text-white fs-1"></i>
        </div>
        <h2 className="fw-bold">Payment confirmed</h2>
        <p className="text-muted">
          Your order <code>{orderId}</code> has been placed successfully.
        </p>
        <p
          className="visually-hidden"
          data-status="paid"
        >
          paid
        </p>
        <button
          className="btn btn-dark mt-3"
          onClick={() => onNavigate("shop")}
        >
          Back to shop
        </button>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="container py-5 text-center">
        <div
          className="rounded-circle bg-danger d-inline-flex align-items-center justify-content-center mb-4"
          style={{ width: 80, height: 80 }}
        >
          <i className="bi bi-x-lg text-white fs-1"></i>
        </div>
        <h2 className="fw-bold">Payment failed</h2>
        <p className="text-muted">
          Something went wrong with your payment. Please try again.
        </p>
        <p
          className="visually-hidden"
          data-status="failed"
        >
          failed
        </p>
        <button
          className="btn btn-dark mt-3"
          onClick={() => onNavigate("checkout")}
        >
          Try again
        </button>
      </div>
    );
  }

  // Timeout fallback
  return (
    <div className="container py-5 text-center">
      <i className="bi bi-clock-history display-1 text-muted"></i>
      <h2 className="fw-bold mt-3">Still processing</h2>
      <p className="text-muted">
        Your order <code>{orderId}</code> is taking longer than expected.
        Check back in a moment.
      </p>
      <p
        className="visually-hidden"
        data-status="timeout"
      >
        timeout
      </p>
      <button className="btn btn-dark mt-3" onClick={() => onNavigate("shop")}>
        Back to shop
      </button>
    </div>
  );
}