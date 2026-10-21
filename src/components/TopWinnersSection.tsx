import React from 'react';
import { ExternalLink, Star, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { Fragrance, DecantSize } from '../types';

interface TopWinnersSectionProps {
  winners: Fragrance[];
  onOpenShopeeCheckout: (fragrance: Fragrance, selectedSize: DecantSize) => void;
  onOpenFragranceDetail: (fragrance: Fragrance) => void;
}

export const TopWinnersSection: React.FC<TopWinnersSectionProps> = ({
  winners,
  onOpenFragranceDetail,
}) => {
  const getRankBadge = (rank?: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2C2415] border border-[#C5A880] text-[#E5C390] text-xs font-semibold tracking-wider uppercase rounded-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C390]" />
          <span>Juara 1 Komunitas</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1F2228] border border-[#9CA3AF] text-[#E5E7EB] text-xs font-semibold tracking-wider uppercase rounded-sm">
          <span>Juara 2 Komunitas</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-[#231E18] border border-[#B47B50] text-[#D8A279] text-xs font-semibold tracking-wider uppercase rounded-sm">
        <span>Juara 3 Komunitas</span>
      </div>
    );
  };

  return (
    <section id="top-winners" className="py-20 lg:py-28 bg-[#15171C] border-b border-[#26282E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#26282E]">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
              Hasil Voting Terkunci · Siap Kirim
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F3F0EA]">
              Top 3 Decants Pilihan Komunitas
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl">
              Tiga parfum dengan perolehan suara tertinggi dari siklus minggu lalu yang telah dibotolkan
              secara higienis di laboratorium decant Sniff Society. Tersedia untuk order langsung di Shopee.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#A1A1AA] bg-[#121316] px-4 py-2.5 rounded-sm border border-[#2E3138] shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#25D366]" />
            <span>Garansi Batch Code Resmi & Anti Pecah</span>
          </div>
        </div>

        {/* 3 Winners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12">
          {winners.slice(0, 3).map((item, index) => {
            return (
              <div
                key={item.id}
                className="group flex flex-col bg-[#1A1C21] border border-[#2A2D35] hover:border-[#C5A880]/50 rounded-sm transition-all duration-300 relative overflow-hidden shadow-lg"
              >
                {/* Image Container with Luxury Scrim */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121316]">
                  <img
                    src={item.image}
                    alt={`${item.brand} ${item.name}`}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C21] via-transparent to-transparent" />

                  {/* Rank Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    {getRankBadge(item.winnerRank || index + 1)}
                  </div>

                  {/* Quick Detail Trigger */}
                  <button
                    onClick={() => onOpenFragranceDetail(item)}
                    className="absolute top-4 right-4 z-10 p-2 bg-[#121316]/80 hover:bg-[#121316] text-[#A1A1AA] hover:text-[#C5A880] rounded-sm text-xs font-medium backdrop-blur-sm border border-[#2E3138] transition-colors cursor-pointer"
                    title="Lihat Piramida Aroma FragDB"
                  >
                    FragDB Info
                  </button>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">

                  <div className="space-y-3">
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between text-xs text-[#8F9098]">
                      <span className="uppercase tracking-[0.15em] font-medium text-[#C5A880]">
                        {item.brand}
                      </span>
                      <span>{item.category} · {item.gender}</span>
                    </div>

                    {/* Perfume Title */}
                    <h3
                      onClick={() => onOpenFragranceDetail(item)}
                      className="text-xl font-serif text-[#F3F0EA] hover:text-[#C5A880] transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>

                    {/* Rating Breakdown & Batch */}
                    <div className="flex items-center gap-3 text-xs text-[#A1A1AA]">
                      <div className="flex items-center gap-1 text-[#E5C390]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-semibold text-white">{item.rating}</span>
                      </div>
                      <span>({item.ratingCount} reviews)</span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-[#71717A] truncate">
                        Batch #{item.batchCode.split(' ')[0]}
                      </span>
                    </div>

                    {/* Olfactory Notes Preview */}
                    <div className="p-3 bg-[#131418] border border-[#24262C] rounded-sm text-xs space-y-1.5">
                      <div className="text-[11px] uppercase tracking-wider text-[#71717A]">
                        Olfactory Notes
                      </div>
                      <p className="text-[#C4C4CC] line-clamp-2 leading-relaxed">
                        <strong className="text-[#F3F0EA] font-medium">Top:</strong> {item.notes.top.join(', ')} ·{' '}
                        <strong className="text-[#F3F0EA] font-medium">Mid:</strong> {item.notes.mid.join(', ')} ·{' '}
                        <strong className="text-[#F3F0EA] font-medium">Base:</strong> {item.notes.base.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Shopee Action & Reassurance */}
                  <div className="space-y-4 pt-4 border-t border-[#26282E]">

                    {/* Prominent Beli di Shopee button */}
                    <a
                      href={item.shopeeUrl || 'https://shopee.co.id'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 bg-[#EE4D2D] hover:bg-[#d83f20] text-white text-xs uppercase tracking-[0.12em] font-semibold rounded-sm transition-all shadow-md shadow-[#EE4D2D]/20 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Beli di Shopee</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                    </a>

                    {/* Extra reassurance */}
                    <div className="flex items-center justify-between text-[11px] text-[#71717A] px-1">
                      <span>✓ Siap Kirim Hari Ini</span>
                      <span>✓ Botol Kaca Atomizer</span>
                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};