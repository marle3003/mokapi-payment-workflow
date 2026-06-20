import { useState } from "react";
import { useCart } from "../context/CartContext";
import { BACKEND_URL } from "../config";

export default function CheckoutPage({ onNavigate }: { onNavigate: PageNavigator }) {
  const { cartItems, totalPrice, userId } = useCart();
  const [orderId] = useState("order-" + Math.random().toString(36).slice(2, 9));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);

    try {
      // create a checkout session with the payment service.
      const res = await fetch(`${BACKEND_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          userId,
          amount: totalPrice,
          currency: "USD",
          successUrl: `${window.location.origin}/?page=confirmation&orderId=${orderId}`,
        }),
      });

      if (!res.ok) throw new Error("Could not create checkout session");

      const { paymentUrl } = await res.json();

      // Redirect to the Mokapi payment page
      window.location.href = paymentUrl;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-bold">Nothing to check out</h2>
        <button className="btn btn-dark mt-3" onClick={() => onNavigate("shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h1 className="h3 fw-bold mb-1">Checkout</h1>
          <p className="text-muted mb-4">Review your order before paying.</p>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Order items</h6>
              {cartItems.map((item) => (
                <div
                  className="d-flex justify-content-between mb-2 small"
                  key={item.product.id}
                >
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 id="order-id-title" className="fw-semibold mb-1">Order ID</h6>
              <code className="text-muted small" aria-labelledby="order-id-title">
                {orderId}
              </code>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              className="btn btn-dark btn-lg"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Redirecting...
                </>
              ) : (
                `Pay $${totalPrice.toFixed(2)}`
              )}
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={() => onNavigate("cart")}
              disabled={loading}
            >
              Back to cart
            </button>
          </div>

          <p className="text-muted small text-center mt-3">
            You will be redirected to our payment provider to complete your
            purchase.
          </p>
        </div>
      </div>
    </div>
  );
}