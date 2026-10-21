import React, { useState } from 'react';
import { X, ExternalLink, ShieldCheck, Check, ShoppingBag, Sparkles, Tag, Truck } from 'lucide-react';
import { Fragrance, DecantSize } from '../types';
import { formatIDR } from '../utils/votingEngine';

interface ShopeeCheckoutModalProps {
  fragrance: Fragrance | null;
  selectedSize: DecantSize;
  onClose: () => void;
}

export const ShopeeCheckoutModal: React.FC<ShopeeCheckoutModalProps> = ({
  fragrance,
  selectedSize,
  onClose,
}) => {
  const [currentSize, setCurrentSize] = useState<DecantSize>(selectedSize);
  const [voucherApplied, setVoucherApplied] = useState(true);

  if (!fragrance) return null;

  const rawPrice = fragrance.decantPricing[currentSize] || 75000;
  const discountAmount = voucherApplied ? 15000 : 0;
  const finalPrice = Math.max(10000, rawPrice - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#181A1F] border border-[#2E3138] rounded-sm shadow-2xl my-8 overflow-hidden animate-fadeIn">

        {/* Shopee Themed Header Bar */}
        <div className="bg-[#EE4D2D] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                Shopee Checkout Gateway · Sniff Society Official
              </h3>
              <p className="text-[11px] text-white/90">Star+ Seller Terverifikasi · 100% Original Decant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Shopee Modal"
            className="p-1 hover:bg-black/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Product Summary Row */}
          <div className="flex gap-4 p-3.5 bg-[#121316] border border-[#26282E] rounded-sm">
            <img
              src={fragrance.image}
              alt={fragrance.name}
              className="w-16 h-16 object-cover rounded-sm bg-[#1A1C21]"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#C5A880] tracking-wider">
                {fragrance.brand}
              </span>
              <h4 className="text-sm font-serif font-semibold text-[#F3F0EA]">
                {fragrance.name}
              </h4>
              <div className="text-xs text-[#8F9098]">
                Botol Kaca Atomizer Sprayer · {currentSize}
              </div>
            </div>
          </div>

          {/* Size Variant Picker */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#A1A1AA] font-medium">
              Ubah Ukuran Decant:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['2ml', '3ml', '5ml', '10ml'] as DecantSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setCurrentSize(size)}
                  className={`py-2 text-xs font-mono font-medium rounded-sm border transition-all ${currentSize === size
                      ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] font-bold'
                      : 'bg-[#121316] text-[#A1A1AA] border-[#2E3138] hover:border-[#52525B]'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Packaging Quality Guarantees */}
          <div className="p-3.5 bg-[#121316] border border-[#26282E] rounded-sm space-y-2 text-xs text-[#C4C4CC]">
            <div className="flex items-center gap-2 text-[#25D366] font-medium text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Standar Laboratorium Decant Sniff Society:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-[#A1A1AA] pl-5 list-disc">
              <li>Syringe extraction steril tanpa kontak udara luar (0% oksidasi)</li>
              <li>Botol kaca borosilikat tebal dengan tutup cap ulir segel parafilm</li>
              <li>Free kartu sertifikasi Batch Code resmi (#{fragrance.batchCode.split(' ')[0]})</li>
              <li>Garansi retur ganti baru 100% jika botol pecah di ekspedisi</li>
            </ul>
          </div>

          {/* Community Voucher Box */}
          <div className="p-3 bg-[#1A1C21] border border-[#EE4D2D]/40 rounded-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#EE4D2D]" />
              <div>
                <span className="text-xs font-bold text-[#F3F0EA] block">SCENTWEEK48</span>
                <span className="text-[10px] text-[#A1A1AA]">Voucher Komunitas Top 3 (Hemat Rp 15.000)</span>
              </div>
            </div>
            <button
              onClick={() => setVoucherApplied(!voucherApplied)}
              className="text-xs font-semibold text-[#EE4D2D] hover:underline"
            >
              {voucherApplied ? 'Lepas' : 'Pakai'}
            </button>
          </div>

          {/* Pricing Calculation Breakdown */}
          <div className="space-y-1.5 text-xs text-[#A1A1AA] pt-2 border-t border-[#26282E]">
            <div className="flex justify-between">
              <span>Harga Normal Decant ({currentSize}):</span>
              <span className="font-mono">{formatIDR(rawPrice)}</span>
            </div>
            {voucherApplied && (
              <div className="flex justify-between text-[#25D366]">
                <span>Diskon Komunitas Sniff Society:</span>
                <span className="font-mono">- {formatIDR(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-bold text-[#F3F0EA] pt-2 border-t border-[#26282E]">
              <span>Total di Shopee:</span>
              <span className="font-mono text-base text-[#EE4D2D]">
                {formatIDR(finalPrice)}
              </span>
            </div>
          </div>

          {/* Action to Shopee */}
          <div className="space-y-2 pt-2">
            <a
              href="https://shopee.co.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#EE4D2D] hover:bg-[#d83f20] text-white text-xs font-bold uppercase tracking-[0.14em] rounded-sm transition-all shadow-lg shadow-[#EE4D2D]/20 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Lanjut Order di Aplikasi Shopee</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="text-center">
              <span className="text-[11px] text-[#71717A]">
                Pembayaran didukung: ShopeePay, SPayLater, Transfer Bank, & COD
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
