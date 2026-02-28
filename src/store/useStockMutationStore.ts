import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StockMutation, MutationType } from '@/types';
import { supabase } from '@/lib/supabase';
import { useProductStore } from './useProductStore';

interface StockMutationState {
    mutations: StockMutation[];
    loading: boolean;
    error: string | null;
    fetchMutations: () => Promise<void>;
    addMutation: (mutationData: Omit<StockMutation, 'id' | 'createdAt'>) => Promise<void>;
}

export const useStockMutationStore = create<StockMutationState>()(
    persist(
        (set, get) => ({
            mutations: [],
            loading: false,
            error: null,

            fetchMutations: async () => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('stock_mutations')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    if (data) {
                        const formatted = data.map((mut: any) => ({
                            id: mut.id,
                            productId: mut.product_id,
                            productName: mut.product_name,
                            type: mut.type,
                            quantity: mut.quantity,
                            note: mut.note,
                            createdAt: mut.created_at,
                            userId: mut.user_id,
                            userName: mut.user_id ? 'Kasir' : 'Guest',
                        }));
                        set({ mutations: formatted, error: null });
                    }
                } catch (err: any) {
                    console.error('Fetch mutations error:', err.message);
                    set({ error: err.message });
                } finally {
                    set({ loading: false });
                }
            },

            addMutation: async (mutationData) => {
                try {
                    const { data: dbData, error: mutError } = await supabase
                        .from('stock_mutations')
                        .insert([{
                            product_id: mutationData.productId,
                            product_name: mutationData.productName,
                            type: mutationData.type,
                            quantity: mutationData.quantity,
                            note: mutationData.note,
                            user_id: mutationData.userId
                        }])
                        .select()
                        .single();

                    if (mutError) throw mutError;

                    // Update corresponding product stock
                    const { products, fetchProducts } = useProductStore.getState();
                    const product = products.find(p => p.id === mutationData.productId);
                    if (product) {
                        let newStock = product.stock;
                        if (mutationData.type === 'IN' || mutationData.type === 'RETURN') {
                            newStock += mutationData.quantity;
                        } else if (mutationData.type === 'OUT') {
                            newStock = Math.max(0, newStock - mutationData.quantity);
                        }

                        const { error: tsError } = await supabase
                            .from('products')
                            .update({ stock: newStock })
                            .eq('id', product.id);

                        if (tsError) throw tsError;

                        await fetchProducts(); // Refresh local product store
                    }

                    await get().fetchMutations();
                } catch (err: any) {
                    console.error('Add mutation error:', err.message);
                    alert(`Gagal menyimpan mutasi ke database:\n${err.message}\n\nMutasi hanya disimpan sementara.`);
                    // Fallback local UI update
                    const newMutation: StockMutation = {
                        ...mutationData,
                        id: Math.random().toString(36).substring(2, 9),
                        createdAt: new Date().toISOString(),
                    };

                    // Handle Local Stock update fallback
                    const { products, updateProduct } = useProductStore.getState();
                    const product = products.find(p => p.id === mutationData.productId);
                    if (product) {
                        let newStock = product.stock;
                        if (mutationData.type === 'IN' || mutationData.type === 'RETURN') {
                            newStock += mutationData.quantity;
                        } else if (mutationData.type === 'OUT') {
                            newStock = Math.max(0, newStock - mutationData.quantity);
                        }
                        updateProduct(product.id, { stock: newStock });
                    }

                    set({ mutations: [newMutation, ...get().mutations] });
                }
            },
        }),
        {
            name: 'stock-mutation-storage',
            partialize: (state) => ({ mutations: state.mutations }),
        }
    )
);
