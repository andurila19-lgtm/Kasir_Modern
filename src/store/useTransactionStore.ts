import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '@/types';
import { TRANSACTIONS } from '@/lib/data';
import { supabase } from '@/lib/supabase';

interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    fetchTransactions: () => Promise<void>;
    addTransaction: (transaction: Transaction) => Promise<void>;
    clearHistory: () => void;
    resetTransactions: () => Promise<void>;
}

export const useTransactionStore = create<TransactionState>()(
    persist(
        (set, get) => ({
            transactions: [],
            loading: false,
            error: null,

            fetchTransactions: async () => {
                set({ loading: true });
                try {
                    const { data, error } = await supabase
                        .from('transactions')
                        .select('*, items:transaction_items(*)')
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    if (data) set({ transactions: data as any });
                } catch (err: any) {
                    console.error('Fetch transactions error:', err.message);
                } finally {
                    set({ loading: false });
                }
            },

            addTransaction: async (transaction) => {
                try {
                    const { data: trxData, error: trxError } = await supabase
                        .from('transactions')
                        .insert([{
                            id: transaction.id,
                            subtotal: transaction.subtotal,
                            tax: transaction.tax,
                            total: transaction.total,
                            payment_method: transaction.paymentMethod,
                            amount_paid: transaction.amountPaid,
                            change: transaction.change,
                            cashier_id: null // Assuming auth is handled elsewhere or null for now
                        }])
                        .select();

                    if (trxError) throw trxError;

                    const itemsToInsert = transaction.items.map(item => ({
                        transaction_id: transaction.id,
                        product_id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }));

                    const { error: itemsError } = await supabase
                        .from('transaction_items')
                        .insert(itemsToInsert);

                    if (itemsError) throw itemsError;

                    await get().fetchTransactions();
                } catch (err: any) {
                    console.error('Add transaction error:', err.message);
                    // Local fallback
                    set((state) => ({ transactions: [transaction, ...state.transactions] }));
                }
            },
            resetTransactions: async () => {
                set({ loading: true });
                try {
                    // Delete items first due to foreign key constraints if any (though usually Cascade delete is better)
                    const { error: itemsError } = await supabase.from('transaction_items').delete().neq('id', '0'); // Hack to delete all
                    const { error: trxError } = await supabase.from('transactions').delete().neq('id', '0');

                    if (itemsError || trxError) throw itemsError || trxError;

                    set({ transactions: [] });
                } catch (err: any) {
                    console.error('Reset transactions error:', err.message);
                    set({ transactions: [] }); // Still clear local if DB fail or just to be safe
                } finally {
                    set({ loading: false });
                }
            },
            clearHistory: () => set({ transactions: [] }),
        }),
        {
            name: 'transaction-storage',
            partialize: (state) => ({ transactions: state.transactions }),
        }
    )
);
