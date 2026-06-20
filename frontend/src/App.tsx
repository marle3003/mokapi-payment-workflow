import { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";

function getInitialPage() {
  const params = new URLSearchParams(window.location.search);
  return params.get("page") || "shop";
}

function getOrderIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("orderId") || null;
}

export default function App() {
  const [page, setPage] = useState(getInitialPage);
  const [orderId, setOrderId] = useState(getOrderIdFromUrl);

  function navigate(target: string, newOrderId?: string) {
    setPage(target);
    if (newOrderId) setOrderId(newOrderId);
    window.history.pushState({}, "", target === "shop" ? "/" : `/?page=${target}`);
  }

  // Handle browser back/forward
  useEffect(() => {
    function onPopState() {
      setPage(getInitialPage());
      setOrderId(getOrderIdFromUrl());
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <CartProvider>
      <div className="min-vh-100 bg-light">
        <Navbar onNavigate={navigate} />
        <main>
          {page === "shop" && <ShopPage onNavigate={navigate} />}
          {page === "cart" && <CartPage onNavigate={navigate} />}
          {page === "checkout" && <CheckoutPage onNavigate={navigate} />}
          {page === "confirmation" && (
            <ConfirmationPage orderId={orderId} onNavigate={navigate} />
          )}
        </main>
      </div>
    </CartProvider>
  );
}