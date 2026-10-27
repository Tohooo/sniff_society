import React from 'react';
import { X, Star, Droplets, Clock, Wind, Calendar, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { Fragrance, DecantSize } from '../types';
import { formatIDR } from '../utils/votingEngine';

interface FragranceDetailModalProps {
  fragrance: Fragrance | null;
  onClose: () => void;
  onToggleVote: (id: string) => void;
  hasVoted: boolean;
  onOpenShopee: (fragrance: Fragrance, size: DecantSize) => void;
}

export const FragranceDetailModal: React.FC<FragranceDetailModalProps> = ({
  fragrance,
  onClose,
  onToggleVote,
  hasVoted,
  onOpenShopee,
}) => {
  if (!fragrance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#17191E] border border-[#2E3138] rounded-sm shadow-2xl my-8 overflow-hidden animate-fadeIn">

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup Detail"
          className="absolute top-4 right-4 z-20 p-2 text-[#A1A1AA] hover:text-white bg-[#121316]/70 hover:bg-[#121316] rounded-full border border-[#2E3138] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid: Image Left, Details Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">

          {/* Image & Quick Highlights */}
          <div className="md:col-span-5 bg-[#121316] relative flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-[#26282E]">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-sm overflow-hidden bg-[#1A1C21] border border-[#26282E]">
                <img
                  src={fragrance.image}
                  alt={fragrance.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold">
                  FragDB Database Specs
                </div>
                <div className="space-y-1.5 text-xs text-[#A1A1AA]">
                  <div className="flex justify-between py-1 border-b border-[#23252B]">
                    <span>Konsentrasi:</span>
                    <strong className="text-[#F3F0EA]">{fragrance.concentration}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#23252B]">
                    <span>Nose / Perfumer:</span>
                    <strong className="text-[#F3F0EA]">{fragrance.perfumer}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#23252B]">
                    <span>Tahun Rilis:</span>
                    <strong className="text-[#F3F0EA]">{fragrance.releaseYear}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#23252B]">
                    <span>Asal Negara:</span>
                    <strong className="text-[#F3F0EA]">{fragrance.originCountry}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#23252B]">
                    <span>Batch Code:</span>
                    <strong className="text-[#25D366] font-mono">{fragrance.batchCode}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#26282E] flex items-center gap-2 text-[11px] text-[#8F9098]">
              <ShieldCheck className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Otentikasi Botol Flacon Terverifikasi Sniff Society</span>
            </div>
          </div>

          {/* Details & Notes */}
          <div className="md:col-span-7 p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">

              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                  {fragrance.brand}
                </span>
                <h3 className="text-2xl font-serif text-[#F3F0EA] mt-1">
                  {fragrance.name}
                </h3>
                {fragrance.subtitle && (
                  <p className="text-xs text-[#8F9098] italic mt-0.5">{fragrance.subtitle}</p>
                )}
              </div>

              {/* Rating and Vote Stat */}
              <div className="flex items-center gap-4 py-3 px-4 bg-[#121316] border border-[#26282E] rounded-sm text-xs">
                <div className="flex items-center gap-1.5 text-[#E5C390]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-white text-sm">{fragrance.rating}</span>
                  <span className="text-[#71717A]">({fragrance.ratingCount} reviews)</span>
                </div>
                <div className="h-4 w-[1px] bg-[#2E3138]" />
                <div className="text-[#A1A1AA]">
                  Suara Siklus Ini: <strong className="text-[#C5A880] font-mono">{fragrance.votes}</strong>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#C4C4CC] leading-relaxed">
                {fragrance.description}
              </p>

              {/* Olfactory Pyramid Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-[#A1A1AA] font-semibold">
                  Piramida Aroma (Olfactory Architecture)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-[#121316] border border-[#23252B] rounded-sm">
                    <span className="text-[11px] font-semibold text-[#E5C390] uppercase tracking-wider block mb-1">
                      Top Notes
                    </span>
                    <p className="text-[#C4C4CC]">{fragrance.notes.top.join(' · ')}</p>
                  </div>
                  <div className="p-2.5 bg-[#121316] border border-[#23252B] rounded-sm">
                    <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider block mb-1">
                      Middle Notes
                    </span>
                    <p className="text-[#C4C4CC]">{fragrance.notes.mid.join(' · ')}</p>
                  </div>
                  <div className="p-2.5 bg-[#121316] border border-[#23252B] rounded-sm">
                    <span className="text-[11px] font-semibold text-[#C5A880] uppercase tracking-wider block mb-1">
                      Base Notes
                    </span>
                    <p className="text-[#C4C4CC]">{fragrance.notes.base.join(' · ')}</p>
                  </div>
                </div>
              </div>

              {/* Performance Radar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-[#121316] border border-[#23252B] rounded-sm">
                  <span className="text-[10px] text-[#71717A] block">Ketahanan</span>
                  <strong className="text-[#F3F0EA] text-[11px]">{fragrance.longevity}</strong>
                </div>
                <div className="p-2 bg-[#121316] border border-[#23252B] rounded-sm">
                  <span className="text-[10px] text-[#71717A] block">Pancaran (Sillage)</span>
                  <strong className="text-[#F3F0EA] text-[11px]">{fragrance.sillage}</strong>
                </div>
                <div className="p-2 bg-[#121316] border border-[#23252B] rounded-sm">
                  <span className="text-[10px] text-[#71717A] block">Musim Cocok</span>
                  <strong className="text-[#F3F0EA] text-[11px]">{fragrance.season}</strong>
                </div>
              </div>

              {/* Decant Price Reference */}
              {/* <div className="space-y-1.5 pt-2">
                <span className="text-[11px] uppercase tracking-wider text-[#71717A]">
                  Harga Decant Resmi (Kaca Borosilikat):
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {(['2ml', '3ml', '5ml', '10ml'] as DecantSize[]).map((size) => (
                    <div key={size} className="p-2 bg-[#121316] border border-[#26282E] rounded-sm">
                      <span className="text-[10px] font-mono text-[#8F9098] block">{size}</span>
                      <span className="text-xs font-mono font-semibold text-[#F3F0EA]">
                        {formatIDR(fragrance.decantPricing[size])}
                      </span>
                    </div>
                  ))}
                </div>
              </div> */}

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#26282E] flex items-center gap-3">
              <button
                onClick={() => onToggleVote(fragrance.id)}
                className={`flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${hasVoted
                  ? 'bg-[#2A2318] text-[#E5C390] border border-[#C5A880]'
                  : 'bg-[#C5A880] text-[#121316] hover:bg-[#b8986d]'
                  }`}
              >
                {hasVoted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Sudah Anda Vote (Klik Batal)</span>
                  </>
                ) : (
                  <span>Vote untuk Minggu Depan</span>
                )}
              </button>

              <a
                href={fragrance.shopeeUrl || 'https://shopee.co.id'}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-[#EE4D2D] hover:bg-[#d83f20] text-white text-xs font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#EE4D2D]/20"
              >
                <span>Beli di Shopee</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
