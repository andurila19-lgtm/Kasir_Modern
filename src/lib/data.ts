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
        description: 'Nasi goreng autentik dengan bumbu rempah rahasia, ayam suwir, telur mata sapi, dan acar segar.',
        price: 28000,
        stock: 50,
        image: '/nasi_goreng_premium_1772152384011.png',
        categoryId: '1',
        categoryName: 'Makanan',
    },
    {
        id: '2',
        name: 'Es Teh Manis Lemon',
        description: 'Teh seduh segar dengan perasan lemon asli dan daun mint.',
        price: 8000,
        stock: 100,
        image: '/es_teh_manis_premium_1772152403955.png',
        categoryId: '2',
        categoryName: 'Minuman',
    },
    {
        id: '3',
        name: 'Pisang Goreng Gourmet',
        description: 'Pisang goreng renyah dengan topping keju melimpah, cokelat mesis, dan kental manis.',
        price: 18000,
        stock: 35,
        image: '/pisang_goreng_premium_1772152423614.png',
        categoryId: '3',
        categoryName: 'Snack',
    },
    {
        id: '4',
        name: 'Kopi Susu Aren',
        description: 'Espresso premium dengan susu segar dan gula aren organik.',
        price: 22000,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1570968015863-d392681c3b01?w=400',
        categoryId: '2',
        categoryName: 'Minuman',
    },
    {
        id: '5',
        name: 'Kentang Goreng Truffle',
        description: 'Kentang goreng premium dengan aroma truffle oil and parmesan.',
        price: 25000,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        categoryId: '3',
        categoryName: 'Snack',
    },
    {
        id: '6',
        name: 'Ayam Bakar Madu',
        description: 'Ayam bakar dengan olesan madu spesial dan sambal terasi.',
        price: 35000,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
        categoryId: '1',
        categoryName: 'Makanan',
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
