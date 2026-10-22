import React, { useState, useEffect } from 'react';
import { X, Plus, ShieldCheck, Check, Edit3, Image as ImageIcon } from 'lucide-react';
import { Fragrance, FragranceCategory, FragranceGender, UserProfile } from '../types';

interface UploadFragranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddFragrance: (newFrag: Fragrance) => void;
    currentUser: UserProfile;
    editFragrance?: Fragrance | null;
}

export const UploadFragranceModal: React.FC<UploadFragranceModalProps> = ({
    isOpen,
    onClose,
    onAddFragrance,
    currentUser,
    editFragrance = null,
}) => {
    const isSuperAdmin = currentUser.role === 'superadmin';

    const [brand, setBrand] = useState('Mykonos');
    const [name, setName] = useState('');
    const [category, setCategory] = useState<FragranceCategory>('Gourmand');
    const [gender, setGender] = useState<FragranceGender>('Unisex');
    const [concentration, setConcentration] = useState('Eau de Parfum');
    const [batchCode, setBatchCode] = useState('MYK-ID-2026');
    const [perfumer, setPerfumer] = useState('Local Artisan');
    const [releaseYear, setReleaseYear] = useState('2024');
    const [topNotes, setTopNotes] = useState('Matcha, Bergamot');
    const [midNotes, setMidNotes] = useState('Jasmine');
    const [baseNotes, setBaseNotes] = useState('Vanilla, Musk');
    const [description, setDescription] = useState('');
    const [shopeeUrl, setShopeeUrl] = useState('https://shopee.co.id');
    const [imageUrl, setImageUrl] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        if (editFragrance) {
            setBrand(editFragrance.brand || '');
            setName(editFragrance.name || '');
            setCategory(editFragrance.category || 'Gourmand');
            setGender(editFragrance.gender || 'Unisex');
            setConcentration(editFragrance.concentration || 'Eau de Parfum');
            setBatchCode(editFragrance.batchCode || 'BATCH-2026');
            setPerfumer(editFragrance.perfumer || 'Local Artisan');
            setReleaseYear(String(editFragrance.releaseYear || 2024));
            setTopNotes(editFragrance.notes?.top?.join(', ') || '');
            setMidNotes(editFragrance.notes?.mid?.join(', ') || '');
            setBaseNotes(editFragrance.notes?.base?.join(', ') || '');
            setDescription(editFragrance.description || '');
            setShopeeUrl(editFragrance.shopeeUrl || 'https://shopee.co.id');
            setImageUrl(editFragrance.image || '');
        } else {
            setBrand('Mykonos');
            setName('');
            setCategory('Gourmand');
            setGender('Unisex');
            setConcentration('Eau de Parfum');
            setBatchCode('MYK-ID-2026');
            setPerfumer('Local Artisan');
            setReleaseYear('2024');
            setTopNotes('Matcha, Bergamot');
            setMidNotes('Jasmine');
            setBaseNotes('Vanilla, Musk');
            setDescription('');
            setShopeeUrl('https://shopee.co.id');
            setImageUrl('');
        }
    }, [editFragrance, isOpen]);

    // Handler konversi file lokal ke Base64
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSuperAdmin) {
            alert('Akses ditolak! Hanya Super Admin yang dapat mengelola database parfum.');
            return;
        }

        if (!brand.trim() || !name.trim()) {
            alert('Nama Brand dan Nama Parfum wajib diisi!');
            return;
        }

        const updatedFragrance: Fragrance = {
            id: editFragrance ? editFragrance.id : `custom-${Date.now()}`,
            brand: brand.trim(),
            name: name.trim(),
            category,
            gender,
            concentration,
            image: imageUrl.trim() || editFragrance?.image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
            notes: {
                top: topNotes.split(',').map((s) => s.trim()).filter(Boolean),
                mid: midNotes.split(',').map((s) => s.trim()).filter(Boolean),
                base: baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
            },
            perfumer,
            releaseYear: parseInt(releaseYear, 10) || 2024,
            batchCode,
            originCountry: 'Indonesia',
            rating: editFragrance ? editFragrance.rating : 4.8,
            ratingCount: editFragrance ? editFragrance.ratingCount : 5,
            ratingsBreakdown: editFragrance ? editFragrance.ratingsBreakdown : { 5: 4, 4: 1, 3: 0, 2: 0, 1: 0 },
            votes: editFragrance ? editFragrance.votes : 10,
            longevity: editFragrance ? editFragrance.longevity : '8-10 Jam',
            sillage: editFragrance ? editFragrance.sillage : 'Moderate to Strong',
            season: editFragrance ? editFragrance.season : 'All Seasons / Tropis',
            decantPricing: editFragrance ? editFragrance.decantPricing : { '2ml': 0, '3ml': 0, '5ml': 0, '10ml': 0 },
            shopeeUrl: shopeeUrl.trim() || 'https://shopee.co.id',
            description: description || `Koleksi eksklusif ${name} dari ${brand}.`,
        };

        onAddFragrance(updatedFragrance);
        setFormSuccess(true);
        setTimeout(() => {
            setFormSuccess(false);
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#17191E] border border-[#C5A880]/50 rounded-sm shadow-2xl my-8 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#26282E] bg-[#121316]">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                        <div>
                            <h3 className="text-base font-serif text-[#F3F0EA]">
                                {editFragrance ? `Edit Parfum: ${editFragrance.name}` : 'Upload Parfum Baru (Super Admin)'}
                            </h3>
                            <p className="text-xs text-[#8F9098]">
                                {editFragrance ? 'Perbarui informasi detail dan foto parfum' : 'Tambahkan koleksi parfum lokal atau global dengan foto dari komputer'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Tutup"
                        className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138] cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Form */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {formSuccess && (
                        <div className="p-3 mb-4 bg-[#14291E] border border-[#25D366] text-[#25D366] text-xs rounded-sm flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            <span>{editFragrance ? 'Perubahan parfum berhasil disimpan!' : 'Parfum berhasil diupload dan ditambahkan ke katalog!'}</span>
                        </div>
                    )}

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Nama Brand / Rumah Parfum</label>
                                <input
                                    type="text"
                                    required
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    placeholder="Contoh: Mykonos / HMNS"
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Nama Parfum</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Contoh: Matcha Latte"
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Kategori Olfaktori</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as FragranceCategory)}
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                >
                                    <option value="Woody">Woody</option>
                                    <option value="Oriental">Oriental</option>
                                    <option value="Fresh">Fresh</option>
                                    <option value="Floral">Floral</option>
                                    <option value="Gourmand">Gourmand</option>
                                    <option value="Leather">Leather</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value as FragranceGender)}
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                >
                                    <option value="Unisex">Unisex</option>
                                    <option value="Pour Homme">Pour Homme (Pria)</option>
                                    <option value="Pour Femme">Pour Femme (Wanita)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Konsentrasi</label>
                                <input
                                    type="text"
                                    value={concentration}
                                    onChange={(e) => setConcentration(e.target.value)}
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                />
                            </div>
                        </div>

                        {/* Upload File Gambar dari Lokal */}
                        <div className="space-y-1.5">
                            <label className="text-xs text-[#A1A1AA] flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-[#C5A880]" />
                                <span>Upload Foto Botol Parfum (Dari Komputer Lokal)</span>
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFileChange}
                                    className="w-full text-xs text-[#A1A1AA] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#2A2318] file:text-[#E5C390] hover:file:bg-[#342b1e] file:cursor-pointer bg-[#121316] border border-[#2E3138] rounded-sm p-1"
                                />
                            </div>
                            {imageUrl && (
                                <div className="mt-2 flex items-center gap-3 p-2 bg-[#121316] border border-[#26282E] rounded-sm">
                                    <img src={imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-sm border border-[#2E3138]" />
                                    <span className="text-[11px] text-[#25D366]">✓ Foto lokal berhasil dimuat dan siap disimpan</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Top Notes (Dipisah Koma)</label>
                                <input
                                    type="text"
                                    value={topNotes}
                                    onChange={(e) => setTopNotes(e.target.value)}
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Heart / Middle Notes (Dipisah Koma)</label>
                                <input
                                    type="text"
                                    value={midNotes}
                                    onChange={(e) => setMidNotes(e.target.value)}
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs text-[#A1A1AA]">Base Notes (Dipisah Koma)</label>
                                <input
                                    type="text"
                                    value={baseNotes}
                                    onChange={(e) => setBaseNotes(e.target.value)}
                                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 pt-2">
                            <label className="text-xs text-[#A1A1AA]">Link Pembelian Shopee</label>
                            <input
                                type="text"
                                value={shopeeUrl}
                                onChange={(e) => setShopeeUrl(e.target.value)}
                                placeholder="https://shopee.co.id/..."
                                className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-[#A1A1AA]">Deskripsi Singkat</label>
                            <textarea
                                rows={2}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-[#26282E]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-[#121316] text-[#A1A1AA] text-xs rounded-sm border border-[#2E3138] cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                {editFragrance ? <Edit3 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                <span>{editFragrance ? 'Simpan Perubahan' : 'Upload & Publikasikan'}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};