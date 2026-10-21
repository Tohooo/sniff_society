import { searchFragrances } from './services/fragellaApi';
import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TopWinnersSection } from './components/TopWinnersSection';
import { VotingArenaSection } from './components/VotingArenaSection';
import { KritikSaranSection } from './components/KritikSaranSection';
import { FragranceDetailModal } from './components/FragranceDetailModal';
import { ReviewModal } from './components/ReviewModal';
import { WhatsAppSimulationModal } from './components/WhatsAppSimulationModal';
import { ShopeeCheckoutModal } from './components/ShopeeCheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { Footer } from './components/Footer';
import { AdminSuggestionModal } from './components/AdminSuggestionModal';
import { UploadFragranceModal } from './components/UploadFragranceModal';
import { INITIAL_FRAGRANCES, INITIAL_REVIEWS, INITIAL_SUGGESTIONS } from './data/fragranceData';
import { Fragrance, Review, Suggestion, UserProfile, DecantSize } from './types';
import { getTopWinners, toggleFragranceVote, canUserVote } from './utils/votingEngine';

export default function App() {
  // State Navigasi Halaman ('dashboard' | 'winners' | 'katalog' | 'kritik' | 'carakerja')
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'winners' | 'katalog' | 'kritik' | 'carakerja'>('dashboard');

  const [isAdminSuggestionOpen, setIsAdminSuggestionOpen] = useState(false);

  const handleDeleteSuggestion = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    showToast('Aspirasi berhasil dihapus.');
  };

  const handleUpdateSuggestionStatus = (id: string, status: Suggestion['status']) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast('Status aspirasi berhasil diperbarui.');
  };

  const handleReplySuggestion = (id: string, replyText: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, adminReply: `"${replyText}"` } : s))
    );
    showToast('Balasan resmi tim berhasil disimpan.');
  };

  const [editingFragrance, setEditingFragrance] = useState<Fragrance | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [fragrances, setFragrances] = useState<Fragrance[]>(() => {
    const saved = localStorage.getItem('sniff_society_fragrances');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Gagal memparsing data dari localStorage', e);
      }
    }
    return INITIAL_FRAGRANCES;
  });

  useEffect(() => {
    localStorage.setItem('sniff_society_fragrances', JSON.stringify(fragrances));
  }, [fragrances]);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [suggestions, setSuggestions] = useState<Suggestion[]>(INITIAL_SUGGESTIONS);
  const [cycleNumber, setCycleNumber] = useState<number>(48);

  const [user, setUser] = useState<UserProfile>({
    role: 'guest',
    name: 'Tamu Penikmat Aroma',
    email: 'guest@scentsociety.id',
    phone: '081289201928',
    votedIds: [],
    maxVotes: 3,
    waSubscribed: true,
  });

  // Modal Dialog States
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWAOpen, setIsWAOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [detailFragrance, setDetailFragrance] = useState<Fragrance | null>(null);
  const [reviewFragrance, setReviewFragrance] = useState<Fragrance | null>(null);
  const [shopeeCheckout, setShopeeCheckout] = useState<{
    fragrance: Fragrance;
    size: DecantSize;
  } | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentWinners = useMemo(() => {
    return getTopWinners(fragrances, 3);
  }, [fragrances]);

  const totalVotesAcrossAll = useMemo(() => {
    return fragrances.reduce((acc, f) => acc + f.votes, 0);
  }, [fragrances]);

  // Vote toggle handler dengan validasi login
  const handleToggleVote = (fragranceId: string) => {
    // Jika user belum login (masih guest), buka modal Auth & hentikan proses vote
    if (user.role === 'guest') {
      setIsAuthOpen(true);
      showToast('Silakan masuk/login terlebih dahulu untuk memberikan suara.');
      return;
    }

    const check = canUserVote(user.votedIds, fragranceId, user.maxVotes);
    if (!check.canVote) {
      showToast(check.reason || 'Batas kuota vote telah tercapai');
      return;
    }

    try {
      const { newVotedIds, action } = toggleFragranceVote(
        user.votedIds,
        fragranceId,
        user.maxVotes
      );

      setUser((prev) => ({ ...prev, votedIds: newVotedIds }));

      setFragrances((prev) =>
        prev.map((item) => {
          if (item.id === fragranceId) {
            return {
              ...item,
              votes: action === 'added' ? item.votes + 1 : Math.max(0, item.votes - 1),
            };
          }
          return item;
        })
      );

      const fragranceItem = fragrances.find((f) => f.id === fragranceId);
      if (action === 'added') {
        showToast(
          `✓ Berhasil memilih "${fragranceItem?.name}". Sisa kuota: ${user.maxVotes - newVotedIds.length} vote.`
        );
      } else {
        showToast(
          `Suara untuk "${fragranceItem?.name}" dibatalkan. Kuota vote bertambah 1.`
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Terjadi kesalahan saat memproses vote');
    }
  };

  const handleUpvoteSuggestion = (id: string) => {
    setSuggestions((prev) =>
      prev.map((sug) => {
        if (sug.id === id) {
          const isUpvoted = !sug.userUpvoted;
          return {
            ...sug,
            upvotes: isUpvoted ? sug.upvotes + 1 : Math.max(0, sug.upvotes - 1),
            userUpvoted: isUpvoted,
          };
        }
        return sug;
      })
    );
  };

  const handleSubmitSuggestion = (newSug: Omit<Suggestion, 'id' | 'upvotes' | 'date'>) => {
    const item: Suggestion = {
      ...newSug,
      id: `sug-${Date.now()}`,
      upvotes: 1,
      userUpvoted: true,
      date: 'Hari ini',
    };
    setSuggestions((prev) => [item, ...prev]);
    showToast('Aspirasi Anda berhasil dikirim!');
  };

  const handleSubmitReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Hari ini',
      helpfulCount: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Review dan rating Anda berhasil ditambahkan!');
  };

  const handleAddFragrance = (savedFrag: Fragrance) => {
    setFragrances((prev) => {
      const exists = prev.some((f) => f.id === savedFrag.id);
      if (exists) {
        return prev.map((f) => (f.id === savedFrag.id ? savedFrag : f));
      }
      return [savedFrag, ...prev];
    });
    showToast(`Parfum "${savedFrag.name}" berhasil diperbarui!`);
  };

  const handleResetCycleVotes = () => {
    setFragrances((prev) => prev.map((f) => ({ ...f, votes: 0 })));
    setUser((prev) => ({ ...prev, votedIds: [] }));
    setCycleNumber((c) => c + 1);
    showToast(`Siklus #${cycleNumber + 1} dimulai!`);
  };

  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const filteredFragrances = useMemo(() => {
    if (!selectedBrand) return fragrances;
    return fragrances.filter((f) => f.brand === selectedBrand);
  }, [fragrances, selectedBrand]);

  const handleLockWinners = () => {
    setIsAdminOpen(false);
    setIsWAOpen(true);
    showToast(`Top 3 Winners dikunci!`);
  };

  return (
    <div className="min-h-screen bg-[#121316] text-[#F3F0EA] flex flex-col font-sans selection:bg-[#C5A880] selection:text-[#121316]">

      {/* Super Admin Top Banner Notice */}
      {user.role === 'superadmin' && (
        <div className="bg-[#2A2318] border-b border-[#C5A880]/40 text-[#E5C390] px-4 py-2 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
            <span>Mode Super Admin Aktif · Kelola kurasi, unggah parfum, dan moderasi saran.</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#C5A880] text-[#121316] font-semibold px-3 py-1 rounded-sm hover:bg-[#d4b790] transition-colors cursor-pointer"
            >
              + Upload Parfum
            </button>
            <button
              onClick={() => setIsAdminSuggestionOpen(true)}
              className="bg-[#1A1C21] border border-[#C5A880] text-[#E5C390] font-semibold px-3 py-1 rounded-sm hover:bg-[#252830] transition-colors cursor-pointer"
            >
              Kelola Saran & Kritik
            </button>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="underline font-semibold hover:text-white cursor-pointer"
            >
              Panel Siklus
            </button>
          </div>
        </div>
      )}

      {/* Navbar Header (Selalu Muncul) - Kirim props navigasi halaman */}
      <Header
        user={user}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWA={() => setIsWAOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        remainingVotes={user.maxVotes - user.votedIds.length}
        totalVotesCount={totalVotesAcrossAll}
      />

      {/* Konten Halaman Berdasarkan Menu yang Dipilih */}
      <main className="flex-1">

        {/* 1. MENU DASHBOARD */}
        {currentPage === 'dashboard' && (
          <HeroSection
            onExploreVoting={() => setCurrentPage('katalog')}
            onExploreWinners={() => setCurrentPage('winners')}
            totalVotesCount={totalVotesAcrossAll}
          />
        )}

        {/* 2. MENU TOP 3 WINNERS */}
        {currentPage === 'winners' && (
          <TopWinnersSection
            winners={currentWinners}
            onOpenShopeeCheckout={(fragrance, selectedSize) => {
              setShopeeCheckout({ fragrance, size: selectedSize });
            }}
            onOpenFragranceDetail={(fragrance) => setDetailFragrance(fragrance)}
          />
        )}

        {/* 3 & 4. MENU KATALOG PARFUM (Voting Arena & FragDB Catalog) */}
        {currentPage === 'katalog' && (
          <VotingArenaSection
            fragrances={filteredFragrances}
            votedIds={user.votedIds}
            maxVotes={user.maxVotes}
            onToggleVote={handleToggleVote}
            onOpenFragranceDetail={(fragrance) => setDetailFragrance(fragrance)}
            onOpenWriteReview={(fragrance) => setReviewFragrance(fragrance)}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            onApiResultsLoaded={(newFragrances) => setFragrances(newFragrances)}
          />
        )}

        {/* 5. MENU KRITIK & SARAN */}
        {currentPage === 'kritik' && (
          <KritikSaranSection
            suggestions={suggestions}
            onUpvoteSuggestion={handleUpvoteSuggestion}
            onSubmitSuggestion={handleSubmitSuggestion}
            user={user}
          />
        )}

      </main>

      {/* 6. FOOTER (Selalu Muncul di Setiap Halaman) */}
      <Footer onNavigate={(page) => setCurrentPage(page)} />

      {/* Modals & Dialogs */}
      <FragranceDetailModal
        fragrance={detailFragrance}
        onClose={() => setDetailFragrance(null)}
        onToggleVote={handleToggleVote}
        hasVoted={detailFragrance ? user.votedIds.includes(detailFragrance.id) : false}
        onOpenShopee={(fragrance, size) => {
          setShopeeCheckout({ fragrance, size });
        }}
      />

      <ReviewModal
        fragrance={reviewFragrance}
        reviews={reviews}
        onClose={() => setReviewFragrance(null)}
        onSubmitReview={handleSubmitReview}
        user={user}
      />

      <AdminSuggestionModal
        isOpen={isAdminSuggestionOpen}
        onClose={() => setIsAdminSuggestionOpen(false)}
        suggestions={suggestions}
        onDeleteSuggestion={handleDeleteSuggestion}
        onUpdateSuggestionStatus={handleUpdateSuggestionStatus}
        onReplySuggestion={handleReplySuggestion}
        currentUser={user}
      />

      <WhatsAppSimulationModal
        isOpen={isWAOpen}
        onClose={() => setIsWAOpen(false)}
        winners={currentWinners}
        user={user}
        onUpdatePhone={(phone) => setUser((prev) => ({ ...prev, phone }))}
      />

      <ShopeeCheckoutModal
        fragrance={shopeeCheckout?.fragrance || null}
        selectedSize={shopeeCheckout?.size || '5ml'}
        onClose={() => setShopeeCheckout(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          showToast(`Peran berhasil diubah menjadi: ${updated.role.toUpperCase()}`);
        }}
      />

      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        fragrances={fragrances}
        onResetCycleVotes={handleResetCycleVotes}
        onLockWinners={handleLockWinners}
        cycleNumber={cycleNumber}
        currentUser={user}
        onSelectFragranceForEdit={(frag) => {
          setEditingFragrance(frag);
          setIsAdminOpen(false); // Tutup panel admin
          setIsUploadModalOpen(true); // Buka modal form edit
        }}
      />

      <UploadFragranceModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingFragrance(null);
        }}
        onAddFragrance={handleAddFragrance}
        currentUser={user}
        editFragrance={editingFragrance}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1C21] border border-[#C5A880] text-[#F3F0EA] px-4 py-3 rounded-sm shadow-xl text-xs flex items-center gap-3 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}