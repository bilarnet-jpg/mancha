export type ProductCategory = 'camisetas' | 'bones' | 'fantasias' | 'acessorios' | 'colecionaveis' | 'eventos' | 'premium';
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'pre_sale';
export type OrderStatus = 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  sizes?: string[];
  colors?: string[];
  weight?: number;
  isFeatured: boolean;
  isPremiumOnly: boolean;
  isPreSale: boolean;
  status: ProductStatus;
  tags: string[];
  relatedIds?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  minOrder?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isPremiumOnly: boolean;
  isActive: boolean;
}

export interface StoreOrder {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'pix';
  pixCode?: string;
  trackingCode?: string;
  shippingAddress?: Address;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Address {
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export const CATEGORY_CONFIG: Record<ProductCategory, { label: string; emoji: string; color: string }> = {
  camisetas: { label: 'Camisetas', emoji: '👕', color: '#00FF85' },
  bones: { label: 'Bonés', emoji: '🧢', color: '#4FC3F7' },
  fantasias: { label: 'Fantasias', emoji: '🎭', color: '#FF4081' },
  acessorios: { label: 'Acessórios', emoji: '🎒', color: '#FFD700' },
  colecionaveis: { label: 'Colecionáveis', emoji: '🏆', color: '#9C27B0' },
  eventos: { label: 'Eventos', emoji: '🎟️', color: '#FF9800' },
  premium: { label: 'Premium', emoji: '⭐', color: '#FFD700' },
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Camisa Oficial Mancha Verde 2025',
    description: 'A camisa oficial da Mancha Verde para a temporada 2025. Material premium, bordado oficial e conforto máximo para o dia a dia.',
    category: 'camisetas',
    images: [],
    price: 89.90,
    originalPrice: 120.00,
    stock: 150,
    sku: 'CAM-MV-2025',
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    colors: ['Verde', 'Branco'],
    isFeatured: true,
    isPremiumOnly: false,
    isPreSale: false,
    status: 'active',
    tags: ['camisa', 'oficial', '2025'],
    createdAt: '2025-01-01',
  },
  {
    id: 'prod-2',
    name: 'Fantasia Ala das Deusas — Carnaval 2026',
    description: 'Fantasia oficial da Ala das Deusas para o Carnaval 2026. Inclui: top bordado, saia com plumas, cocar e acessórios completos.',
    category: 'fantasias',
    images: [],
    price: 650.00,
    stock: 45,
    sku: 'FAN-DEUSAS-2026',
    sizes: ['P', 'M', 'G', 'GG'],
    isFeatured: true,
    isPremiumOnly: false,
    isPreSale: false,
    status: 'active',
    tags: ['fantasia', 'carnaval', '2026', 'ala'],
    createdAt: '2025-01-01',
  },
  {
    id: 'prod-3',
    name: 'Boné Snapback Mancha Verde',
    description: 'Boné snapback com logo bordado da Mancha Verde. Ajuste traseiro, aba reta, tecido premium.',
    category: 'bones',
    images: [],
    price: 59.90,
    originalPrice: 79.90,
    stock: 80,
    sku: 'BON-MV-001',
    colors: ['Verde', 'Preto'],
    isFeatured: false,
    isPremiumOnly: false,
    isPreSale: false,
    status: 'active',
    tags: ['boné', 'snapback'],
    createdAt: '2025-01-01',
  },
  {
    id: 'prod-4',
    name: 'Kit Fantasia Bateria 2026',
    description: 'Kit completo para integrantes da bateria. Inclui camiseta, calça, colete e acessórios oficiais.',
    category: 'fantasias',
    images: [],
    price: 380.00,
    stock: 30,
    sku: 'FAN-BAT-2026',
    sizes: ['P', 'M', 'G', 'GG', 'XG'],
    isFeatured: true,
    isPremiumOnly: false,
    isPreSale: false,
    status: 'active',
    tags: ['fantasia', 'bateria', '2026'],
    createdAt: '2025-01-01',
  },
  {
    id: 'prod-5',
    name: 'Placa Comemorativa Tricampeonato 2023',
    description: 'Placa comemorativa exclusiva do tricampeonato de 2023. Edição limitada, numerada. Item de colecionador.',
    category: 'colecionaveis',
    images: [],
    price: 199.90,
    stock: 100,
    sku: 'COL-TRICAMPEAO-2023',
    isFeatured: true,
    isPremiumOnly: false,
    isPreSale: false,
    status: 'active',
    tags: ['colecionável', 'tricampeonato', '2023', 'limitado'],
    createdAt: '2025-01-01',
  },
  {
    id: 'prod-6',
    name: 'Mochila Premium Mancha Verde',
    description: 'Mochila resistente com logo bordado. 30L de capacidade, compartimento para notebook, impermeável.',
    category: 'acessorios',
    images: [],
    price: 149.90,
    stock: 60,
    sku: 'ACE-MOCHILA-001',
    colors: ['Verde', 'Preto'],
    isFeatured: false,
    isPremiumOnly: false,
    isPreSale: false,
    status: 'active',
    tags: ['mochila', 'acessório'],
    createdAt: '2025-01-01',
  },
  {
    id: 'prod-7',
    name: 'Pack Premium — Coleção Exclusiva',
    description: 'Pack exclusivo para membros Premium: camisa edição limitada + boné + placa comemorativa.',
    category: 'premium',
    images: [],
    price: 299.90,
    originalPrice: 429.70,
    stock: 20,
    sku: 'PACK-PREMIUM-001',
    isFeatured: true,
    isPremiumOnly: true,
    isPreSale: false,
    status: 'active',
    tags: ['premium', 'pack', 'exclusivo', 'limitado'],
    createdAt: '2025-01-01',
  },
];

export const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', code: 'MANCHA10', type: 'percent', value: 10, usedCount: 0, isPremiumOnly: false, isActive: true },
  { id: 'c2', code: 'VERDE20', type: 'fixed', value: 20, minOrder: 100, usedCount: 0, isPremiumOnly: false, isActive: true },
  { id: 'c3', code: 'PREMIUM15', type: 'percent', value: 15, usedCount: 0, isPremiumOnly: true, isActive: true },
];
