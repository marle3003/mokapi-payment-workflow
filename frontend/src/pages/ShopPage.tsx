import { useCart } from "../context/CartContext";

function svgPlaceholder(label: string, bg = "#dee2e6", fg = "#6c757d") {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="100">
      <rect width="200" height="100" fill="${bg}"/>
      <text
        x="100" y="50"
        font-family="system-ui, sans-serif"
        font-size="16"
        fill="${fg}"
        text-anchor="middle"
        dominant-baseline="middle"
      >${label}</text>
    </svg>
  `.trim();
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Wireless Headphones",
    price: 79.99,
    description: "Over-ear headphones with noise cancellation and 30h battery.",
    image: svgPlaceholder("Headphones"),
  },
  {
    id: "prod-2",
    name: "Mechanical Keyboard",
    price: 129.99,
    description: "Compact TKL layout with tactile switches and RGB backlight.",
    image: svgPlaceholder("Keyboard"),
  },
  {
    id: "prod-3",
    name: "USB-C Hub",
    price: 39.99,
    description: "7-in-1 hub with HDMI, USB-A, SD card reader and PD charging.",
    image: svgPlaceholder("USB-C Hub"),
  },
  {
    id: "prod-4",
    name: "Webcam HD",
    price: 59.99,
    description: "1080p webcam with built-in microphone and auto light correction.",
    image: svgPlaceholder("Webcam HD"),
  },
  {
    id: "prod-5",
    name: "Desk Lamp",
    price: 34.99,
    description: "LED desk lamp with adjustable brightness and USB charging port.",
    image: svgPlaceholder("Desk Lamp"),
  },
  {
    id: "prod-6",
    name: "Mouse Pad XL",
    price: 19.99,
    description: "Extended mouse pad with non-slip base and stitched edges.",
    image: svgPlaceholder("Mouse Pad XL"),
  },
];

export default function ShopPage({ onNavigate }: { onNavigate: PageNavigator }) {
  const { addToCart, totalItems } = useCart();

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Products</h1>
          <p className="text-muted mb-0">Everything you need for your desk setup.</p>
        </div>
        {totalItems > 0 && (
          <button
            className="btn btn-dark"
            onClick={() => onNavigate("cart")}
          >
            View cart ({totalItems})
          </button>
        )}
      </div>

      <div className="row g-4">
        {PRODUCTS.map((product) => (
          <div className="col-sm-6 col-lg-4" key={product.id}>
            <article className="card h-100 shadow-sm border-0" aria-labelledby={`product-${product.id}-title`}>
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body d-flex flex-column">
                <h2 id={`product-${product.id}-title`} className="h3 card-title fw-semibold">{product.name}</h2>
                <p className="card-text text-muted small flex-grow-1">
                  {product.description}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="fs-5 fw-bold">${product.price.toFixed(2)}</span>
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => addToCart(product)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}