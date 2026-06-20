import { useCart } from "../context/CartContext";

export default function CartPage({ onNavigate }: { onNavigate: (target: string) => void }) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h2 className="mt-3 fw-bold">Your cart is empty</h2>
        <p className="text-muted">Add some products before checking out.</p>
        <button
          className="btn btn-dark mt-2"
          onClick={() => onNavigate("shop")}
        >
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="h3 fw-bold mb-4">Your cart</h1>

      <div className="row g-4">
        <section className="col-lg-8" aria-labelledby="cart-items-heading">
          <h2 id="cart-items-heading" className="visually-hidden">Shopping cart items</h2>
          <ul className="list-unstyled p-0 m-0">
            {cartItems.map((item) => (
              <li
                className="card border-0 shadow-sm mb-3"
                key={item.product.id}
              >
                <div className="card-body d-flex align-items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: 80, height: 60, objectFit: "cover" }}
                    className="rounded"
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-semibold mb-0">{item.product.name}</h6>
                    <small className="text-muted">
                      ${item.product.price.toFixed(2)} each
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label={`Decrease quantity of ${item.product.name}`}
                    >
                      -
                    </button>
                    <span className="px-2">
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label={`Increase quantity of ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="fw-bold" style={{ minWidth: 70 }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="btn btn-link text-danger p-0"
                    onClick={() => removeFromCart(item.product.id)}
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-4">Order summary</h5>
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
              <div className="d-flex justify-content-between fw-bold fs-5">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-dark w-100 mt-4"
                onClick={() => onNavigate("checkout")}
              >
                Proceed to checkout
              </button>
              <button
                className="btn btn-link w-100 mt-2 text-muted"
                onClick={() => onNavigate("shop")}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}