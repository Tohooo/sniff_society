import React from 'react';

interface BrandFilterProps {
    brands: string[];
    selectedBrand: string;
    onSelectBrand: (brand: string) => void;
}

export function BrandFilter({ brands, selectedBrand, onSelectBrand }: BrandFilterProps) {
    if (brands.length === 0) return null;

    return (
        <div className="flex items-center gap-2 overflow-x-auto py-2 my-4 scrollbar-none">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Filter Brand:</span>
            <button
                onClick={() => onSelectBrand('')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${selectedBrand === ''
                        ? 'bg-[#C5A880] text-[#121316]'
                        : 'bg-[#1A1C21] text-[#F3F0EA] border border-[#C5A880]/30 hover:border-[#C5A880]'
                    }`}
            >
                Semua Brand
            </button>
            {brands.map((brand) => (
                <button
                    key={brand}
                    onClick={() => onSelectBrand(brand)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${selectedBrand === brand
                            ? 'bg-[#C5A880] text-[#121316]'
                            : 'bg-[#1A1C21] text-[#F3F0EA] border border-[#C5A880]/30 hover:border-[#C5A880]'
                        }`}
                >
                    {brand}
                </button>
            ))}
        </div>
    );
}