export type Role = 'ADMIN' | 'CASHIER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categoryId: string;
    categoryName?: string;
    barcode?: string;
}

export interface CartItem extends Product {
    quantity: number;
    discount?: number; // Discount amount in Rupiah
}

export type PaymentMethod = 'CASH' | 'QRIS' | 'TRANSFER' | 'DEBIT';

export interface Transaction {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    taxRate?: number;
    total: number;
    paymentMethod: PaymentMethod;
    amountPaid: number;
    change: number;
    createdAt: string;
    cashierId: string;
    cashierName: string;
}

export interface DashboardStats {
    todayRevenue: number;
    todayTransactions: number;
    lowStockProducts: number;
    totalProducts: number;
    revenueByDay: { day: string; revenue: number }[];
    bestSellingProducts: { name: string; sales: number }[];
}
