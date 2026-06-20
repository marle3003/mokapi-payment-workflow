interface CartContextType {
  cartItems: Array<CartItem>;
  userId: string;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

interface Product {
  id: string;
  name: string;
  price: number
  description: string;
  image: string
}

interface CartItem {
  product: Product;
  quantity: number;
}

type PageNavigator = (target: string, newOrderId?: string | undefined) => void;