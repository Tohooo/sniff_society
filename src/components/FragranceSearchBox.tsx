import React, { useState } from 'react';
import { searchFragrances } from '../services/fragellaApi';
import { Fragrance } from '../types';

interface SearchBoxProps {
    onApiResultsLoaded: (results: Fragrance[]) => void;
    onLoadingChange: (loading: boolean) => void;
}

export function FragranceSearchBox({ onApiResultsLoaded, onLoadingChange }: SearchBoxProps) {
    const [keyword, setKeyword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi input minimal 3 karakter sesuai aturan endpoint Fragella API
        if (!keyword.trim() || keyword.length < 3) {
            setErrorMessage('Masukkan minimal 3 karakter untuk pencarian parfum.');
            return;
        }

        setErrorMessage(null);
        setIsLoading(true);
        onLoadingChange(true);

        try {
            const response = await searchFragrances({ search: keyword, limit: 10, page: 1 });
            const apiData = response.data || response;

            if (apiData && Array.isArray(apiData)) {
                if (apiData.length === 0) {
                    setErrorMessage('Parfum tidak ditemukan di database Fragella.');
                    onApiResultsLoaded([]);
                } else {
                    // Mapping data dari API Fragella ke struktur tipe data Fragrance Sniff Society
                    const mapped: Fragrance[] = apiData.map((item: any) => ({
                        id: item._id,
                        brand: item.Brand,
                        name: item.Name,
                        subtitle: item.OilType || 'Niche Fragrance',
                        category: item.MainAccords?.[0] || 'Unisex',
                        gender: item.Gender || 'Unisex',
                        concentration: item.OilType || 'Eau de Parfum',
                        image: item['Image URL'] || '/src/assets/images/perfume_baccarat_crimson_1792550618912.jpg',
                        notes: {
                            top: item.Notes?.Top?.map((n: any) => n.name) || item['General Notes']?.slice(0, 3) || [],
                            mid: item.Notes?.Middle?.map((n: any) => n.name) || [],
                            base: item.Notes?.Base?.map((n: any) => n.name) || [],
                        },
                        perfumer: item.perfumers || 'Unknown',
                        releaseYear: Number(item.Year) || 2023,
                        batchCode: 'Official Batch - Fragella',
                        originCountry: item.Country || 'France',
                        rating: Number(item.rating) || 4.8,
                        ratingCount: 150,
                        ratingsBreakdown: { 5: 120, 4: 20, 3: 8, 2: 2, 1: 0 },
                        votes: Math.floor(Math.random() * 200) + 20,
                        longevity: item.Longevity || '8-10 Jam',
                        sillage: item.Sillage || 'Moderate',
                        season: 'All Seasons',
                        decantPricing: {
                            '2ml': 55000,
                            '3ml': 80000,
                            '5ml': 130000,
                            '10ml': 250000,
                        },
                        shopeeUrl: item['Purchase URL'] || 'https://shopee.co.id',
                        description: `Eksklusif ${item.Name} oleh ${item.Brand}. Karakter utama: ${item.MainAccords?.join(', ') || 'Niche'}.`,
                    }));

                    onApiResultsLoaded(mapped);
                }
            }
        } catch (error: any) {
            console.error('Gagal mengambil data dari Fragella API:', error);
            setErrorMessage(error.message || 'Terjadi kesalahan saat terhubung ke server Fragella.');
        } finally {
            setIsLoading(false);
            onLoadingChange(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            if (errorMessage) setErrorMessage(null); // Reset pesan error saat user mulai mengetik ulang
                        }}
                        placeholder="Cari parfum..."
                        disabled={isLoading}
                        className="w-full bg-[#1A1C21] border border-[#C5A880]/30 rounded px-4 py-2 text-sm text-[#F3F0EA] focus:outline-none focus:border-[#C5A880] disabled:opacity-50"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#C5A880] text-[#121316] font-semibold px-5 py-2 rounded text-sm hover:bg-[#d4b790] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            {/* Indikator Spinner Loading */}
                            <svg className="animate-spin h-4 w-4 text-[#121316]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Mencari...</span>
                        </>
                    ) : (
                        <span>Cari Parfum</span>
                    )}
                </button>
            </form>

            {/* Kotak Tampilan Pesan Error / Validasi */}
            {errorMessage && (
                <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 px-3 py-1.5 rounded flex items-center gap-2 animate-fadeIn">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{errorMessage}</span>
                </div>
            )}
        </div>
    );
}