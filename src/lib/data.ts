import { Category, Product, Transaction, DashboardStats } from '@/types';
import { subDays, format } from 'date-fns';
import { id } from 'date-fns/locale';

export const CATEGORIES: Category[] = [
    { id: '1', name: 'Makanan', slug: 'makanan' },
    { id: '2', name: 'Minuman', slug: 'minuman' },
    { id: '3', name: 'Snack', slug: 'snack' },
    { id: '4', name: 'Alat Tulis', slug: 'alat-tulis' },
];

export const PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur dan ayam',
        price: 25000,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1512058560366-cd2427ee086f?w=400',
        categoryId: '1',
        categoryName: 'Makanan',
    },
    {
        id: '2',
        name: 'Es Teh Manis',
        description: 'Teh manis dingin menyegarkan',
        price: 5000,
        stock: 100,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
        categoryId: '2',
        categoryName: 'Minuman',
    },
    {
        id: '3',
        name: 'Ayam Bakar',
        description: 'Ayam bakar dengan bumbu kecap',
        price: 30000,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
        categoryId: '1',
        categoryName: 'Makanan',
    },
    {
        id: '4',
        name: 'Kopi Susu Gula Aren',
        description: 'Kopi dengan susu dan gula aren asli',
        price: 18000,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1570968015863-d392681c3b01?w=400',
        categoryId: '2',
        categoryName: 'Minuman',
    },
    {
        id: '5',
        name: 'Kentang Goreng',
        description: 'Kentang goreng renyah',
        price: 15000,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        categoryId: '3',
        categoryName: 'Snack',
    },
    {
        id: '6',
        name: 'Buku Tulis Sidu',
        description: 'Buku tulis 38 lembar',
        price: 4000,
        stock: 200,
        image: 'https://images.unsplash.com/photo-1531346680769-a1d7d8b5de90?w=400',
        categoryId: '4',
        categoryName: 'Alat Tulis',
    },
];

export const TRANSACTIONS: Transaction[] = [
    {
        id: 'TRX-1001',
        items: [
            { ...PRODUCTS[0], quantity: 2 },
            { ...PRODUCTS[1], quantity: 2 },
        ],
        subtotal: 60000,
        tax: 6000,
        total: 66000,
        paymentMethod: 'CASH',
        amountPaid: 100000,
        change: 34000,
        createdAt: subDays(new Date(), 0).toISOString(),
        cashierId: '1',
        cashierName: 'Ahmad Admin',
    },
    {
        id: 'TRX-1002',
        items: [
            { ...PRODUCTS[2], quantity: 1 },
            { ...PRODUCTS[3], quantity: 1 },
        ],
        subtotal: 48000,
        tax: 4800,
        total: 52800,
        paymentMethod: 'QRIS',
        amountPaid: 52800,
        change: 0,
        createdAt: subDays(new Date(), 0).toISOString(),
        cashierId: '1',
        cashierName: 'Ahmad Admin',
    },
];

export const getDashboardStats = (): DashboardStats => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        return {
            day: format(d, 'EEE', { locale: id }),
            revenue: Math.floor(Math.random() * 2000000) + 500000,
        };
    });

    return {
        todayRevenue: 1250000,
        todayTransactions: 45,
        lowStockProducts: 3,
        totalProducts: PRODUCTS.length,
        revenueByDay: last7Days,
        bestSellingProducts: [
            { name: 'Nasi Goreng Spesial', sales: 120 },
            { name: 'Es Teh Manis', sales: 250 },
            { name: 'Ayam Bakar', sales: 85 },
            { name: 'Kopi Susu', sales: 110 },
        ],
    };
};
