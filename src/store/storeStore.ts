import { create } from 'zustand';
import { Product, CartItem, StoreOrder, Coupon, MOCK_PRODUCTS, MOCK_COUPONS } from '../types/store';

interface StoreState {
  products: Product[];
  featuredProducts: Product[];
  selectedProduct: Product | null;
  cart: CartItem[];
  favorites: string[];
  orders: StoreOrder[];
  currentOrder: StoreOrder | null;
  appliedCoupon: Coupon | null;
  activeCategory: string;
  searchQuery: string;
  isLoading: boolean;

  loadProducts: () => void;
  selectProduct: (id: string) => void;
  setCategory: (cat: string) => void;
  setSearch: (q: string) => void;
  getFiltered: () => Product[];

  addToCart: (product: Product, size?: string, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  applyCoupon: (code: string, isPremium: boolean) => string | null;
  removeCoupon: () => void;
  getDiscount: () => number;
  getFinalTotal: () => number;

  createPixOrder: (userId: string, address?: any) => StoreOrder;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  cart: [],
  favorites: [],
  orders: [],
  currentOrder: null,
  appliedCoupon: null,
  activeCategory: 'all',
  searchQuery: '',
  isLoading: false,

  loadProducts: () => {
    set({
      products: MOCK_PRODUCTS,
      featuredProducts: MOCK_PRODUCTS.filter(p => p.isFeatured),
    });
  },

  selectProduct: (id) => {
    const product = MOCK_PRODUCTS.find(p => p.id === id) ?? null;
    set({ selectedProduct: product });
  },

  setCategory: (cat) => set({ activeCategory: cat }),
  setSearch: (q) => set({ searchQuery: q }),

  getFiltered: () => {
    const { products, activeCategory, searchQuery } = get();
    let result = products;
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  },

  addToCart: (product, size, color) => {
    const { cart } = get();
    const existing = cart.find(i => i.product.id === product.id && i.selectedSize === size && i.selectedColor === color);
    if (existing) {
      set({ cart: cart.map(i => i.product.id === product.id && i.selectedSize === size ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ cart: [...cart, { product, quantity: 1, selectedSize: size, selectedColor: color }] });
    }
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(i => i.product.id !== productId) });
  },

  updateQty: (productId, qty) => {
    if (qty <= 0) { get().removeFromCart(productId); return; }
    set({ cart: get().cart.map(i => i.product.id === productId ? { ...i, quantity: qty } : i) });
  },

  clearCart: () => set({ cart: [], appliedCoupon: null }),

  getCartTotal: () => get().cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

  getCartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

  toggleFavorite: (productId) => {
    const { favorites } = get();
    if (favorites.includes(productId)) {
      set({ favorites: favorites.filter(id => id !== productId) });
    } else {
      set({ favorites: [...favorites, productId] });
    }
  },

  isFavorite: (productId) => get().favorites.includes(productId),

  applyCoupon: (code, isPremium) => {
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) return 'Cupom inválido.';
    if (coupon.isPremiumOnly && !isPremium) return 'Cupom exclusivo para membros Premium.';
    if (coupon.minOrder && get().getCartTotal() < coupon.minOrder) return `Pedido mínimo de R$ ${coupon.minOrder.toFixed(2)}.`;
    set({ appliedCoupon: coupon });
    return null;
  },

  removeCoupon: () => set({ appliedCoupon: null }),

  getDiscount: () => {
    const { appliedCoupon } = get();
    if (!appliedCoupon) return 0;
    const total = get().getCartTotal();
    if (appliedCoupon.type === 'percent') return total * (appliedCoupon.value / 100);
    return Math.min(appliedCoupon.value, total);
  },

  getFinalTotal: () => get().getCartTotal() - get().getDiscount(),

  createPixOrder: (userId, address) => {
    const { cart, appliedCoupon } = get();
    const subtotal = get().getCartTotal();
    const discount = get().getDiscount();
    const total = get().getFinalTotal();
    const pixCode = `00020126580014BR.GOV.BCB.PIX0136mancha-loja@pix.com.br5204000053039865802BR5925MANCHA CARNAVAL LOJA6009SAO PAULO62290525LOJA${Date.now()}6304ABCD`;

    const order: StoreOrder = {
      id: `order-store-${Date.now()}`,
      userId,
      items: cart.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.images[0] ?? '',
        quantity: i.quantity,
        unitPrice: i.product.price,
        selectedSize: i.selectedSize,
        selectedColor: i.selectedColor,
      })),
      subtotal,
      discount,
      total,
      couponCode: appliedCoupon?.code,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'pix',
      pixCode,
      shippingAddress: address,
      createdAt: new Date().toISOString(),
    };

    set({ currentOrder: order, orders: [order, ...get().orders] });
    return order;
  },
}));
