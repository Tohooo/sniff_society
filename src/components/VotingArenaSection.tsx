import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, Check, Plus, Minus, Info, MessageSquare, Edit3, Trash2, Filter, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Fragrance, UserProfile } from '../types';
import { calculateVoteShare } from '../utils/votingEngine';
import { fetchNotesFromDB } from '../services/dbService';

interface VotingArenaSectionProps {
  fragrances: Fragrance[];
  votedIds: string[];
  maxVotes: number;
  onToggleVote: (fragranceId: string) => void;
  onOpenFragranceDetail: (fragrance: Fragrance) => void;
  onOpenWriteReview: (fragrance: Fragrance) => void;
  onOpenHowItWorks: () => void;
  currentUser: UserProfile;
  onEditFragrance: (fragrance: Fragrance) => void;
  onDeleteFragrance: (id: string) => void;
}

export const VotingArenaSection: React.FC<VotingArenaSectionProps> = ({
  fragrances,
  votedIds,
  maxVotes,
  onToggleVote,
  onOpenFragranceDetail,
  onOpenWriteReview,
  onOpenHowItWorks,
  currentUser,
  onEditFragrance,
  onDeleteFragrance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk daftar pilihan notes dari database Supabase
  const [availableTopNotes, setAvailableTopNotes] = useState<string[]>([]);
  const [availableMiddleNotes, setAvailableMiddleNotes] = useState<string[]>([]);
  const [availableBaseNotes, setAvailableBaseNotes] = useState<string[]>([]);

  // State untuk filter notes yang dipilih (multi-select array)
  const [selectedTopFilter, setSelectedTopFilter] = useState<string[]>([]);
  const [selectedMidFilter, setSelectedMidFilter] = useState<string[]>([]);
  const [selectedBaseFilter, setSelectedBaseFilter] = useState<string[]>([]);

  // State untuk mengontrol buka/tutup dropdown pemilihan notes
  const [openTopDropdown, setOpenTopDropdown] = useState(false);
  const [openMidDropdown, setOpenMidDropdown] = useState(false);
  const [openBaseDropdown, setOpenBaseDropdown] = useState(false);

  // State untuk Pagination (Halaman Aktif)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Jumlah maksimal card parfum per halaman

  // Ambil data notes dari Supabase saat komponen dimuat
  useEffect(() => {
    async function loadFilterNotes() {
      const top = await fetchNotesFromDB('top_notes');
      const middle = await fetchNotesFromDB('middle_notes');
      const base = await fetchNotesFromDB('base_notes');
      setAvailableTopNotes(top);
      setAvailableMiddleNotes(middle);
      setAvailableBaseNotes(base);
    }
    loadFilterNotes();
  }, []);

  // Reset ke halaman 1 setiap kali pencarian atau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopFilter, selectedMidFilter, selectedBaseFilter]);

  // Helper untuk memilih note
  const addFilterNote = (note: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!list.includes(note)) {
      setList([...list, note]);
    }
  };

  // Helper untuk menghapus note yang sudah dipilih
  const removeFilterNote = (note: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(list.filter((item) => item !== note));
  };

  // Compute total votes across all candidates
  const totalVotesAcrossAll = useMemo(() => {
    return fragrances.reduce((sum, item) => sum + item.votes, 0);
  }, [fragrances]);

  // Filtered fragrances berdasarkan kemiripan pencarian teks dan notes multi-select
  const filteredList = useMemo(() => {
    return fragrances.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        if (!matchName && !matchBrand) return false;
      }

      if (selectedTopFilter.length > 0) {
        const hasMatch = selectedTopFilter.some((filterNote) =>
          item.notes?.top?.some((n) => n.toLowerCase().includes(filterNote.toLowerCase()))
        );
        if (!hasMatch) return false;
      }

      if (selectedMidFilter.length > 0) {
        const hasMatch = selectedMidFilter.some((filterNote) =>
          item.notes?.mid?.some((n) => n.toLowerCase().includes(filterNote.toLowerCase()))
        );
        if (!hasMatch) return false;
      }

      if (selectedBaseFilter.length > 0) {
        const hasMatch = selectedBaseFilter.some((filterNote) =>
          item.notes?.base?.some((n) => n.toLowerCase().includes(filterNote.toLowerCase()))
        );
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [fragrances, searchQuery, selectedTopFilter, selectedMidFilter, selectedBaseFilter]);

  // Total Halaman berdasarkan hasil filter
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // Data parfum yang ditampilkan di halaman saat ini saja
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(start, start + itemsPerPage);
  }, [filteredList, currentPage]);

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
              </div>
            </div>

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

        {/* Catalog Search & Filter Suite */}
        <div id="fragdb-catalog" className="p-6 bg-[#16181D] border border-[#26282E] rounded-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                onClick={() => { }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#C5A880] text-[#121316] font-semibold text-xs rounded-sm hover:bg-[#d4b790] transition-colors cursor-pointer"
              >
                Cari Parfum
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] self-start md:self-auto">
              <span className="px-2 py-1 bg-[#1F2228] border border-[#2E3138] font-mono text-[11px] text-[#C5A880] rounded-sm flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>Notes Filter Active</span>
              </span>
              <span>{filteredList.length} Fragrance Ditemukan</span>
            </div>
          </div>

          {/* Area Filter Notes yang Dipilih */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2 border-t border-[#26282E]">

            {/* Top Notes Filter */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">Filter Top Notes</label>
                <button
                  type="button"
                  onClick={() => setOpenTopDropdown(!openTopDropdown)}
                  className="px-2.5 py-1 bg-[#1A1C21] hover:bg-[#252830] border border-[#C5A880]/40 text-[#E5C390] text-xs rounded-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Pilih Top Note</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {openTopDropdown && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 p-2 bg-[#17191E] border border-[#C5A880] rounded-sm shadow-xl max-h-48 overflow-y-auto space-y-1">
                  {availableTopNotes
                    .filter((note) => !selectedTopFilter.includes(note))
                    .map((note) => (
                      <div
                        key={note}
                        onClick={() => {
                          addFilterNote(note, selectedTopFilter, setSelectedTopFilter);
                          setOpenTopDropdown(false);
                        }}
                        className="px-2.5 py-1.5 text-xs text-[#F3F0EA] hover:bg-[#C5A880] hover:text-[#121316] rounded-sm cursor-pointer transition-colors"
                      >
                        + {note}
                      </div>
                    ))}
                  {availableTopNotes.filter((note) => !selectedTopFilter.includes(note)).length === 0 && (
                    <div className="px-2 py-1 text-xs text-[#71717A] text-center">Semua sudah dipilih</div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#121316] border border-[#2E3138] rounded-sm min-h-[46px] items-center">
                {selectedTopFilter.length === 0 ? (
                  <span className="text-[11px] text-[#52525B] italic">Belum ada top note yang dipilih</span>
                ) : (
                  selectedTopFilter.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-sm bg-[#C5A880] text-[#121316] font-semibold"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => removeFilterNote(note, selectedTopFilter, setSelectedTopFilter)}
                        className="hover:text-red-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Middle Notes Filter */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">Filter Middle Notes</label>
                <button
                  type="button"
                  onClick={() => setOpenMidDropdown(!openMidDropdown)}
                  className="px-2.5 py-1 bg-[#1A1C21] hover:bg-[#252830] border border-[#C5A880]/40 text-[#E5C390] text-xs rounded-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Pilih Middle Note</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {openMidDropdown && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 p-2 bg-[#17191E] border border-[#C5A880] rounded-sm shadow-xl max-h-48 overflow-y-auto space-y-1">
                  {availableMiddleNotes
                    .filter((note) => !selectedMidFilter.includes(note))
                    .map((note) => (
                      <div
                        key={note}
                        onClick={() => {
                          addFilterNote(note, selectedMidFilter, setSelectedMidFilter);
                          setOpenMidDropdown(false);
                        }}
                        className="px-2.5 py-1.5 text-xs text-[#F3F0EA] hover:bg-[#C5A880] hover:text-[#121316] rounded-sm cursor-pointer transition-colors"
                      >
                        + {note}
                      </div>
                    ))}
                  {availableMiddleNotes.filter((note) => !selectedMidFilter.includes(note)).length === 0 && (
                    <div className="px-2 py-1 text-xs text-[#71717A] text-center">Semua sudah dipilih</div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#121316] border border-[#2E3138] rounded-sm min-h-[46px] items-center">
                {selectedMidFilter.length === 0 ? (
                  <span className="text-[11px] text-[#52525B] italic">Belum ada middle note yang dipilih</span>
                ) : (
                  selectedMidFilter.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-sm bg-[#C5A880] text-[#121316] font-semibold"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => removeFilterNote(note, selectedMidFilter, setSelectedMidFilter)}
                        className="hover:text-red-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Base Notes Filter */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">Filter Base Notes</label>
                <button
                  type="button"
                  onClick={() => setOpenBaseDropdown(!openBaseDropdown)}
                  className="px-2.5 py-1 bg-[#1A1C21] hover:bg-[#252830] border border-[#C5A880]/40 text-[#E5C390] text-xs rounded-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Pilih Base Note</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {openBaseDropdown && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 p-2 bg-[#17191E] border border-[#C5A880] rounded-sm shadow-xl max-h-48 overflow-y-auto space-y-1">
                  {availableBaseNotes
                    .filter((note) => !selectedBaseFilter.includes(note))
                    .map((note) => (
                      <div
                        key={note}
                        onClick={() => {
                          addFilterNote(note, selectedBaseFilter, setSelectedBaseFilter);
                          setOpenBaseDropdown(false);
                        }}
                        className="px-2.5 py-1.5 text-xs text-[#F3F0EA] hover:bg-[#C5A880] hover:text-[#121316] rounded-sm cursor-pointer transition-colors"
                      >
                        + {note}
                      </div>
                    ))}
                  {availableBaseNotes.filter((note) => !selectedBaseFilter.includes(note)).length === 0 && (
                    <div className="px-2 py-1 text-xs text-[#71717A] text-center">Semua sudah dipilih</div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 p-2.5 bg-[#121316] border border-[#2E3138] rounded-sm min-h-[46px] items-center">
                {selectedBaseFilter.length === 0 ? (
                  <span className="text-[11px] text-[#52525B] italic">Belum ada base note yang dipilih</span>
                ) : (
                  selectedBaseFilter.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-sm bg-[#C5A880] text-[#121316] font-semibold"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => removeFilterNote(note, selectedBaseFilter, setSelectedBaseFilter)}
                        className="hover:text-red-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Candidate Fragrance Grid (Menggunakan paginatedList) */}
        {paginatedList.length === 0 ? (
          <div className="text-center py-16 bg-[#17191E] border border-[#26282E] rounded-sm space-y-3">
            <p className="text-sm text-[#A1A1AA]">Tidak ada parfum yang cocok dengan kriteria filter notes tersebut.</p>
            <p className="text-xs text-[#71717A]">Coba kurangi pilihan filter atau reset pilihan notes Anda.</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {paginatedList.map((item) => {
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

                      {currentUser.role === 'superadmin' && !hasVoted && (
                        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#121316]/95 px-2.5 py-1.5 rounded-sm border border-[#C5A880]/60 shadow-xl backdrop-blur-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditFragrance(item);
                            }}
                            title="Edit Parfum"
                            className="flex items-center gap-1 text-[11px] text-[#E5C390] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <span className="text-[#52525B]">|</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFragrance(item.id);
                            }}
                            title="Hapus Parfum"
                            className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
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
                            <div><strong className="text-[#C4C4CC]">Top:</strong> {item.notes?.top?.join(', ')}</div>
                            <div><strong className="text-[#C4C4CC]">Heart:</strong> {item.notes?.mid?.join(', ')}</div>
                            <div><strong className="text-[#C4C4CC]">Base:</strong> {item.notes?.base?.join(', ')}</div>
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

            {/* Navigasi Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-[#26282E]">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3.5 py-2 text-xs rounded-sm border flex items-center gap-1 transition-colors ${currentPage === 1
                    ? 'bg-[#141518] border-[#202227] text-[#52525B] cursor-not-allowed'
                    : 'bg-[#17191E] border-[#2E3138] text-[#F3F0EA] hover:border-[#C5A880] cursor-pointer'
                    }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      type="button"
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-sm border text-xs font-semibold transition-colors cursor-pointer ${currentPage === page
                        ? 'bg-[#C5A880] text-[#121316] border-[#C5A880]'
                        : 'bg-[#17191E] text-[#A1A1AA] border-[#2E3138] hover:border-[#C5A880]'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3.5 py-2 text-xs rounded-sm border flex items-center gap-1 transition-colors ${currentPage === totalPages
                    ? 'bg-[#141518] border-[#202227] text-[#52525B] cursor-not-allowed'
                    : 'bg-[#17191E] border-[#2E3138] text-[#F3F0EA] hover:border-[#C5A880] cursor-pointer'
                    }`}
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};