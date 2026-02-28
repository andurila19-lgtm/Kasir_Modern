import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';
import { PRODUCTS } from '@/lib/data';
import { supabase } from '@/lib/supabase';

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: Omit<Product, 'id' | 'categoryName'>) => Promise<void>;
    updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    reduceStock: (id: string, quantity: number) => Promise<void>;
    importProducts: (products: any[]) => Promise<{ success: number; failed: number }>;
}

export const useProductStore = create<ProductState>()(
    persist(
        (set, get) => ({
            products: [],
            loading: false,
            error: null,

            fetchProducts: async () => {
                set({ loading: true });
                try {
                    const { data: categories } = await supabase.from('categories').select('*');
                    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

                    if (error) throw error;

                    if (data) {
                        const mappedProducts = data.map((p: any) => ({
                            ...p,
                            id: String(p.id),
                            categoryId: String(p.category_id),
                            categoryName: categories?.find(c => String(c.id) === String(p.category_id))?.name || 'Uncategorized'
                        }));
                        set({ products: mappedProducts, error: null });
                    }
                } catch (err: any) {
                    console.error('Fetch products error:', err.message);
                    set({ error: err.message });
                } finally {
                    set({ loading: false });
                }
            },

            addProduct: async (productData) => {
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .insert([{
                            name: productData.name,
                            description: productData.description,
                            price: productData.price,
                            stock: productData.stock,
                            image: productData.image,
                            category_id: productData.categoryId
                        }])
                        .select();

                    if (error) throw error;
                    if (data) await get().fetchProducts();
                } catch (err: any) {
                    console.error('Add product error:', err.message);
                    alert(`Gagal menyimpan ke database:\n${err.message}\n\nProduk hanya disimpan sementara secara lokal dan akan hilang jika halaman dimuat ulang.`);
                    // Local fallback
                    const newProduct: Product = {
                        ...productData,
                        id: Math.random().toString(36).substring(2, 9),
                    };
                    set({ products: [newProduct, ...get().products] });
                }
            },

            updateProduct: async (id, updatedData) => {
                try {
                    const { error } = await supabase
                        .from('products')
                        .update({
                            name: updatedData.name,
                            description: updatedData.description,
                            price: updatedData.price,
                            stock: updatedData.stock,
                            image: updatedData.image,
                            category_id: updatedData.categoryId
                        })
                        .eq('id', id);

                    if (error) throw error;
                    await get().fetchProducts();
                } catch (err: any) {
                    console.error('Update product error:', err.message);
                    set((state) => ({
                        products: state.products.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
                    }));
                }
            },

            deleteProduct: async (id) => {
                try {
                    const { error } = await supabase.from('products').delete().eq('id', id);
                    if (error) throw error;
                    set((state) => ({
                        products: state.products.filter((p) => p.id !== id),
                    }));
                } catch (err: any) {
                    console.error('Delete product error:', err.message);
                    set((state) => ({
                        products: state.products.filter((p) => p.id !== id),
                    }));
                }
            },

            reduceStock: async (id, quantity) => {
                const product = get().products.find(p => p.id === id);
                if (!product) return;

                const newStock = Math.max(0, product.stock - quantity);

                try {
                    const { error } = await supabase
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', id);

                    if (error) throw error;
                    await get().fetchProducts();
                } catch (err: any) {
                    console.error('Reduce stock error:', err.message);
                    set((state) => ({
                        products: state.products.map((p) =>
                            p.id === id ? { ...p, stock: newStock } : p
                        ),
                    }));
                }
            },

            importProducts: async (productsData) => {
                set({ loading: true });
                let success = 0;
                let failed = 0;

                try {
                    // 1. Get or create categories
                    const { data: existingCategories } = await supabase.from('categories').select('*');
                    const categoryMap = new Map(existingCategories?.map(c => [c.name.toLowerCase(), c.id]));

                    for (const item of productsData) {
                        try {
                            let categoryId = item.categoryId;

                            // If categoryName is provided but no ID, try to find or create
                            if (!categoryId && item.categoryName) {
                                const catNameLower = item.categoryName.toLowerCase();
                                if (categoryMap.has(catNameLower)) {
                                    categoryId = categoryMap.get(catNameLower);
                                } else {
                                    const { data: newCat, error: catError } = await supabase
                                        .from('categories')
                                        .insert([{
                                            name: item.categoryName,
                                            slug: item.categoryName.toLowerCase().replace(/\s+/g, '-')
                                        }])
                                        .select()
                                        .single();

                                    if (!catError && newCat) {
                                        categoryId = newCat.id;
                                        categoryMap.set(catNameLower, categoryId);
                                    }
                                }
                            }

                            const { error } = await supabase
                                .from('products')
                                .insert([{
                                    name: item.name,
                                    description: item.description || '',
                                    price: Number(item.price) || 0,
                                    stock: Number(item.stock) || 0,
                                    image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                                    category_id: categoryId || '1' // Fallback to 1 if still null
                                }]);

                            if (error) throw error;
                            success++;
                        } catch (err) {
                            console.error('Import item error:', err);
                            failed++;
                        }
                    }

                    await get().fetchProducts();
                    return { success, failed };
                } catch (err) {
                    console.error('Import process error:', err);
                    return { success: 0, failed: productsData.length };
                } finally {
                    set({ loading: false });
                }
            },
        }),
        {
            name: 'product-storage',
            partialize: (state) => ({ products: state.products }), // Only persist products list
        }
    )
);
