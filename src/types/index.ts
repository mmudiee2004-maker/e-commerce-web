export type Category = 'Leather' | 'Coffee' | 'Ceramics' | 'Candles' | 'Woodwork';

export const CATEGORIES: Category[] = [
  'Leather',
  'Coffee',
  'Ceramics',
  'Candles',
  'Woodwork',
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image_url: string;
  featured: boolean;
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  city: string;
  postal_code: string;
  country: string;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
