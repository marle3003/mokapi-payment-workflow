import { useCart } from "../context/CartContext";

export default function Navbar({ onNavigate }: { onNavigate: PageNavigator }) {
  const { totalItems } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span
        className="navbar-brand fw-bold"
        style={{ cursor: "pointer" }}
        onClick={() => onNavigate("shop")}
      >
        MockShop
      </span>
      <div className="ms-auto d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-light btn-sm position-relative"
          onClick={() => onNavigate("cart")}
        >
          <i className="bi bi-cart3 me-1"></i>
          Cart
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}