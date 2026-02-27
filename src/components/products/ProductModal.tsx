import { useState, useEffect, useRef } from 'react';
import { X, Upload, Package, DollarSign, List, FileText, Loader2 } from 'lucide-react';
import { Product, Category } from '@/types';
import { CATEGORIES } from '@/lib/data';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
    editingProduct?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '1',
        image: '',
        barcode: '',
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price.toString(),
                stock: editingProduct.stock.toString(),
                categoryId: editingProduct.categoryId,
                image: editingProduct.image,
                barcode: editingProduct.barcode || '',
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                categoryId: '1',
                image: '',
                barcode: '',
            });
        }
    }, [editingProduct, isOpen]);

    if (!isOpen) return null;

    const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image: publicUrl });
        } catch (error: any) {
            console.error('Error uploading image:', error.message);
            alert('Gagal mengunggah gambar. Pastikan bucket "products" sudah dibuat dan bersifat Publik.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedCategory = CATEGORIES.find(c => c.id === formData.categoryId);
        onSave({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            categoryName: selectedCategory?.name || 'Lainnya',
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold">{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                        <p className="text-sm text-slate-500">Lengkapi informasi detail produk Anda.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
                                    <Package size={16} className="text-blue-500" /> Nama Produk
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Contoh: Nasi Goreng"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
                                    <List size={16} className="text-blue-500" /> Kategori
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
                                    <List size={16} className="text-blue-500" /> Barcode / SKU
                                </label>
                                <input
                                    type="text"
                                    value={formData.barcode}
                                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Tempel barcode di sini..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
                                        <DollarSign size={16} className="text-blue-500" /> Harga
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
                                        <List size={16} className="text-blue-500" /> Stok
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image & Description */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1.5">Gambar Produk</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative group overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 size={32} className="text-blue-500 animate-spin" />
                                            <p className="text-xs font-medium">Mengunggah...</p>
                                        </div>
                                    ) : formData.image ? (
                                        <>
                                            <img src={formData.image} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <button type="button" className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-xs">Ganti Gambar</button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-6 text-slate-400">
                                            <Upload className="mx-auto mb-2" size={32} />
                                            <p className="text-xs">Klik untuk upload gambar</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUploadImage}
                                />
                                <input
                                    type="text"
                                    className="mt-2 w-full text-[10px] text-slate-400 bg-transparent border-none focus:ring-0 truncate"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="Atau masukkan URL gambar..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
                                    <FileText size={16} className="text-blue-500" /> Deskripsi
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium h-24 resize-none"
                                    placeholder="Detail produk..."
                                />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex items-center justify-end gap-3 p-6 border-t dark:border-slate-800">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isUploading}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                        {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </button>
                </div>
            </div >
        </div >
    );
}
