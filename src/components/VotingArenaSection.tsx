import React, { useState, useMemo } from 'react';
import { Search, Star, Check, Plus, Minus, Info, MessageSquare } from 'lucide-react';
import { Fragrance } from '../types';
import { calculateVoteShare, filterFragrances } from '../utils/votingEngine';

interface VotingArenaSectionProps {
  fragrances: Fragrance[];
  votedIds: string[];
  maxVotes: number;
  onToggleVote: (fragranceId: string) => void;
  onOpenFragranceDetail: (fragrance: Fragrance) => void;
  onOpenWriteReview: (fragrance: Fragrance) => void;
  onOpenHowItWorks: () => void;
}

export const VotingArenaSection: React.FC<VotingArenaSectionProps> = ({
  fragrances,
  votedIds,
  maxVotes,
  onToggleVote,
  onOpenFragranceDetail,
  onOpenWriteReview,
  onOpenHowItWorks,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  // Compute total votes across all candidates
  const totalVotesAcrossAll = useMemo(() => {
    return fragrances.reduce((sum, item) => sum + item.votes, 0);
  }, [fragrances]);

  // Unique brands list for filter
  const brandsList = useMemo(() => {
    const brands = Array.from(new Set(fragrances.map((f) => f.brand))).sort();
    return ['All', ...brands];
  }, [fragrances]);

  const categoriesList = ['All', 'Woody', 'Oriental', 'Fresh', 'Floral', 'Gourmand', 'Leather'];
  const gendersList = ['All', 'Unisex', 'Pour Homme', 'Pour Femme'];

  // Filtered fragrances (Pencarian lokal murni)
  const filteredList = useMemo(() => {
    return filterFragrances(
      fragrances,
      searchQuery,
      selectedBrand,
      selectedCategory,
      selectedGender
    );
  }, [fragrances, searchQuery, selectedBrand, selectedCategory, selectedGender]);

  const remainingVotes = maxVotes - votedIds.length;
  const isSlotUsed = votedIds.length > 0;
  const votedFragranceId = votedIds[0];
  const votedFragrance = isSlotUsed ? fragrances.find((f) => f.id === votedFragranceId) : null;

  return (
    <section id="voting-arena" className="py-20 lg:py-28 bg-[#121316] border-b border-[#26282E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header & Voting Wallet Widget */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#26282E]">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
              Demokrasi Parfum · Cycle #48
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F3F0EA]">
              Weekly Community Voting Arena
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl">
              Tentukan parfum yang akan dibotolkan minggu depan. Setiap anggota memiliki hak 1 suara eksklusif
              yang dapat diubah sewaktu-waktu hingga H-1 sebelum penutupan siklus.
            </p>
          </div>

          {/* User Voting Limit Counter Widget (1 Slot Eksklusif) */}
          <div className="p-5 bg-[#181A1F] border border-[#2E3138] rounded-sm space-y-3 min-w-[320px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A1A1AA] uppercase tracking-wider font-medium">
                Kuota Vote Minggu Ini
              </span>
              <button
                onClick={onOpenHowItWorks}
                className="text-[#C5A880] hover:underline flex items-center gap-1 text-[11px]"
              >
                <Info className="w-3 h-3" />
                <span>Aturan Vote</span>
              </button>
            </div>

            {/* Single Vote Slot */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => {
                  if (isSlotUsed && votedFragranceId) {
                    onToggleVote(votedFragranceId);
                  }
                }}
                className={`w-full p-3 rounded-sm border text-center transition-all ${isSlotUsed
                    ? 'bg-[#2A2318] border-[#C5A880] text-[#E5C390] cursor-pointer hover:bg-[#382f20] hover:border-amber-400 group relative'
                    : 'bg-[#121316] border-[#2A2D35] text-[#52525B]'
                  }`}
                title={isSlotUsed ? `Klik untuk membatalkan vote ${votedFragrance?.name || ''}` : 'Slot Kosong'}
              >
                <div className="text-[10px] uppercase font-mono text-[#A1A1AA]">
                  Slot Eksklusif #1
                </div>
                <div className="text-xs font-semibold truncate mt-1">
                  {isSlotUsed ? (
                    <span className="text-[#F3F0EA] group-hover:text-amber-200 transition-colors">
                      {votedFragrance?.name || 'Terpakai'}
                    </span>
                  ) : (
                    <span className="text-[#52525B]">Kosong (Belum memilih)</span>
                  )}
                </div>
                {isSlotUsed && (
                  <div className="text-[9px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                    Klik untuk Unvote
                  </div>
                )}
              </div>
            </div>

            {/* Status summary */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#26282E]">
              <span className="text-[#8F9098]">
                {remainingVotes > 0 ? (
                  <span>Belum menggunakan hak suara</span>
                ) : (
                  <span className="text-[#25D366] font-medium">Suara utama telah terpakai</span>
                )}
              </span>
              <span className="text-[11px] text-[#71717A]">Dapat diubah bebas</span>
            </div>
          </div>
        </div>

        {/* Local Catalog Search & Filter Suite */}
        <div id="fragdb-catalog" className="p-6 bg-[#16181D] border border-[#26282E] rounded-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Search Input Lokal dengan Tombol Cari */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari parfum berdasarkan nama atau brand..."
                className="w-full pl-10 pr-28 py-2.5 bg-[#121316] border border-[#2E3138] focus:border-[#C5A880] text-sm text-[#F3F0EA] placeholder-[#52525B] rounded-sm outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => { }} // Pencarian berjalan secara real-time via state
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#C5A880] text-[#121316] font-semibold text-xs rounded-sm hover:bg-[#d4b790] transition-colors cursor-pointer"
              >
                Cari Parfum
              </button>
            </div>

            {/* Local Catalog badge */}
            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] self-start md:self-auto">
              <span className="px-2 py-1 bg-[#1F2228] border border-[#2E3138] font-mono text-[11px] text-[#C5A880] rounded-sm">
                Manual Curated Catalog
              </span>
              <span>{filteredList.length} Fragrance Ditemukan</span>
            </div>
          </div>

          {/* Filter Pills / Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#71717A]">Filter Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
              >
                {brandsList.map((brand) => (
                  <option key={brand} value={brand} className="bg-[#121316] text-[#F3F0EA]">
                    {brand === 'All' ? 'Semua Brand' : brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#71717A]">Kategori Olfaktori</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#121316] text-[#F3F0EA]">
                    {cat === 'All' ? 'Semua Kategori' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#71717A]">Target Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
              >
                {gendersList.map((gen) => (
                  <option key={gen} value={gen} className="bg-[#121316] text-[#F3F0EA]">
                    {gen === 'All' ? 'Semua Gender' : gen}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Candidate Fragrance Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 bg-[#17191E] border border-[#26282E] rounded-sm space-y-3">
            <p className="text-sm text-[#A1A1AA]">Belum ada data parfum di katalog.</p>
            <p className="text-xs text-[#71717A]">Gunakan tombol <strong className="text-[#C5A880]">"+ Upload Parfum"</strong> di atas (akun Super Admin) untuk mulai menambahkan koleksi parfum Anda secara manual.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredList.map((item) => {
              const hasVoted = votedIds.includes(item.id);
              const voteShare = calculateVoteShare(item.votes, totalVotesAcrossAll);

              return (
                <div
                  key={item.id}
                  className={`flex flex-col bg-[#17191E] border rounded-sm transition-all duration-300 relative overflow-hidden group ${hasVoted
                      ? 'border-[#C5A880] ring-1 ring-[#C5A880]/30 shadow-lg shadow-[#C5A880]/5'
                      : 'border-[#26282E] hover:border-[#383C45]'
                    }`}
                >
                  <div className="relative aspect-[4/3] w-full bg-[#121316] overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.brand} ${item.name}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17191E] via-transparent to-transparent" />

                    {hasVoted && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 bg-[#C5A880] text-[#121316] text-[11px] font-bold uppercase tracking-wider rounded-sm shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Pilihan Anda</span>
                      </div>
                    )}

                    <button
                      onClick={() => onOpenFragranceDetail(item)}
                      className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-[#121316]/80 hover:bg-[#121316] text-[#F3F0EA] hover:text-[#C5A880] text-xs rounded-sm border border-[#2E3138] backdrop-blur-sm transition-colors cursor-pointer"
                    >
                      Detail Aroma
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-[#A1A1AA] bg-[#121316]/90 px-3 py-1.5 rounded-sm border border-[#2E3138]">
                      <span>Longevity: <strong className="text-white">{item.longevity}</strong></span>
                      <span>Sillage: <strong className="text-white">{item.sillage}</strong></span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="uppercase tracking-[0.18em] text-[#C5A880] font-semibold">
                          {item.brand}
                        </span>
                        <span className="text-[#71717A] text-[11px]">
                          {item.category} · {item.gender}
                        </span>
                      </div>

                      <h3
                        onClick={() => onOpenFragranceDetail(item)}
                        className="text-lg font-serif text-[#F3F0EA] hover:text-[#C5A880] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>

                      <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-[#E5C390]">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="ml-1 font-semibold text-white">{item.rating}</span>
                          </div>
                          <span>({item.ratingCount} rating)</span>
                        </div>

                        <button
                          onClick={() => onOpenWriteReview(item)}
                          className="text-[11px] text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Tulis Review</span>
                        </button>
                      </div>

                      <div className="p-3 bg-[#121316] border border-[#23252B] rounded-sm text-xs space-y-1">
                        <div className="text-[10px] uppercase tracking-wider text-[#71717A]">
                          Piramida Olfaktori
                        </div>
                        <div className="space-y-0.5 text-[#A1A1AA] text-[11px]">
                          <div><strong className="text-[#C4C4CC]">Top:</strong> {item.notes.top.join(', ')}</div>
                          <div><strong className="text-[#C4C4CC]">Heart:</strong> {item.notes.mid.join(', ')}</div>
                          <div><strong className="text-[#C4C4CC]">Base:</strong> {item.notes.base.join(', ')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[#26282E]">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#8F9098]">Perolehan Suara:</span>
                          <div className="flex items-center gap-2 font-mono text-xs">
                            <strong className="text-[#F3F0EA]">{item.votes} Suara</strong>
                            <span className="text-[#C5A880]">({voteShare}%)</span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-[#121316] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5C390] transition-all duration-500 rounded-full"
                            style={{ width: `${Math.max(4, voteShare * 2)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleVote(item.id)}
                        className={`w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-[0.14em] rounded-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${hasVoted
                            ? 'bg-[#2A2318] text-[#E5C390] border border-[#C5A880] hover:bg-[#342b1e]'
                            : remainingVotes > 0
                              ? 'bg-[#1A1C21] hover:bg-[#C5A880] text-[#F3F0EA] hover:text-[#121316] border border-[#2E3138]'
                              : 'bg-[#141518] text-[#52525B] border border-[#202227] hover:border-[#383C45]'
                          }`}
                      >
                        {hasVoted ? (
                          <>
                            <Minus className="w-3.5 h-3.5" />
                            <span>Batalkan Vote (Unvote)</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>
                              {remainingVotes > 0 ? 'Pilih Parfum Ini' : 'Ganti Pilihan Vote'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};