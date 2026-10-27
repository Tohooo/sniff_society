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
import { UserManagementModal } from './components/UserManagementModal';
import { AdminAnalyticsModal } from './components/AdminAnalyticsModal'; // <-- Impor Admin Analytics Modal
import { INITIAL_REVIEWS } from './data/fragranceData';
import { Fragrance, Review, Suggestion, UserProfile, DecantSize } from './types';
import { getTopWinners, toggleFragranceVote, canUserVote } from './utils/votingEngine';
import { BarChart3 } from 'lucide-react'; // <-- Impor icon BarChart3
import {
  fetchFragrancesFromDB,
  insertFragranceToDB,
  updateFragranceVotesDB,
  fetchSuggestionsFromDB,
  insertSuggestionToDB,
  upsertUserToDB,
  fetchUsersFromDB,
  deleteFragranceFromDB
} from './services/dbService';

export default function App() {
  // State Navigasi Halaman ('dashboard' | 'winners' | 'katalog' | 'kritik' | 'carakerja')
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'winners' | 'katalog' | 'kritik' | 'carakerja'>('dashboard');

  const [isAdminSuggestionOpen, setIsAdminSuggestionOpen] = useState(false);
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false); // <-- State untuk Admin Analytics Modal

  // Daftar akun terdaftar untuk manajemen Super Admin
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([
    {
      role: 'superadmin',
      name: 'Admin Sniff Society',
      email: 'admin@sniffsociety.id',
      phone: '08211413989',
      votedIds: [],
      maxVotes: 1,
      waSubscribed: true,
    }
  ]);

  const handleDeleteUser = (email: string) => {
    setRegisteredUsers((prev) => prev.filter((u) => u.email !== email));
    showToast(`Akun dengan email ${email} berhasil dihapus.`);
  };

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

  // MENGAMBIL DATA DARI POSTGRESQL SUPABASE
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingDB, setIsLoadingDB] = useState(true);

  useEffect(() => {
    async function loadDataFromSupabase() {
      setIsLoadingDB(true);
      try {
        const dbFragrances = await fetchFragrancesFromDB();
        const dbSuggestions = await fetchSuggestionsFromDB();
        const dbUsers = await fetchUsersFromDB();

        setFragrances(dbFragrances);
        setSuggestions(dbSuggestions);
        if (dbUsers.length > 0) {
          setRegisteredUsers(dbUsers);
        }
      } catch (err) {
        console.error('Gagal memuat data dari Supabase:', err);
        showToast('Gagal terhubung ke database.');
      } finally {
        setIsLoadingDB(false);
      }
    }
    loadDataFromSupabase();
  }, []);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [cycleNumber, setCycleNumber] = useState<number>(48);

  // Membaca state user dari sessionStorage
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = sessionStorage.getItem('sniff_society_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Gagal memparsing data user dari sessionStorage', e);
      }
    }
    return {
      role: 'guest',
      name: 'Tamu Penikmat Aroma',
      email: 'guest@scentsociety.id',
      phone: '081289201928',
      votedIds: [],
      maxVotes: 1,
      waSubscribed: true,
    };
  });

  useEffect(() => {
    if (user.role === 'guest') {
      sessionStorage.removeItem('sniff_society_current_user');
    } else {
      sessionStorage.setItem('sniff_society_current_user', JSON.stringify(user));
    }
  }, [user]);

  const handleRegisterOrUpdateUser = (updatedUser: UserProfile) => {
    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.email === updatedUser.email);
      if (exists) {
        return prev.map((u) => (u.email === updatedUser.email ? updatedUser : u));
      }
      return [...prev, updatedUser];
    });
  };

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

  // Vote toggle handler dengan sinkronisasi ke PostgreSQL
  const handleToggleVote = async (fragranceId: string) => {
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

      const targetFragrance = fragrances.find((f) => f.id === fragranceId);
      if (!targetFragrance) return;

      const newVotesCount = action === 'added' ? targetFragrance.votes + 1 : Math.max(0, targetFragrance.votes - 1);

      const success = await updateFragranceVotesDB(fragranceId, newVotesCount);
      if (!success) {
        showToast('Gagal menyimpan vote ke database.');
        return;
      }

      setUser((prev) => ({ ...prev, votedIds: newVotedIds }));

      setFragrances((prev) =>
        prev.map((item) => {
          if (item.id === fragranceId) {
            return {
              ...item,
              votes: newVotesCount,
            };
          }
          return item;
        })
      );

      if (action === 'added') {
        showToast(`✓ Berhasil memilih "${targetFragrance.name}".`);
      } else {
        showToast(`Suara untuk "${targetFragrance.name}" dibatalkan.`);
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

  const handleDeleteFragrance = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus parfum ini dari database?')) {
      const success = await deleteFragranceFromDB(id);
      if (success) {
        setFragrances((prev) => prev.filter((f) => f.id !== id));
        showToast('Parfum berhasil dihapus dari database.');
      } else {
        showToast('Gagal menghapus parfum dari database.');
      }
    }
  };

  const handleSubmitSuggestion = async (newSug: Omit<Suggestion, 'id' | 'upvotes' | 'date'>) => {
    const success = await insertSuggestionToDB({
      ...newSug,
      upvotes: 1,
      userUpvoted: true,
      status: 'in_review',
    });

    if (success) {
      const dbSuggestions = await fetchSuggestionsFromDB();
      setSuggestions(dbSuggestions);
      showToast('Aspirasi Anda berhasil dikirim ke database!');
    } else {
      showToast('Gagal mengirim aspirasi.');
    }
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

  const handleAddFragrance = async (savedFrag: Fragrance) => {
    const success = await insertFragranceToDB(savedFrag);
    if (success) {
      const dbFragrances = await fetchFragrancesFromDB();
      setFragrances(dbFragrances);
      showToast(`Parfum "${savedFrag.name}" berhasil disimpan ke database PostgreSQL!`);
    } else {
      showToast('Gagal menyimpan parfum ke database.');
    }
  };

  const handleResetCycleVotes = async () => {
    for (const f of fragrances) {
      await updateFragranceVotesDB(f.id, 0);
    }
    const dbFragrances = await fetchFragrancesFromDB();
    setFragrances(dbFragrances);
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

      {/* Loading Indicator Database */}
      {isLoadingDB && (
        <div className="bg-[#2A2318] text-center text-[#E5C390] text-xs py-1">
          Menghubungkan ke Database PostgreSQL Supabase...
        </div>
      )}

      {/* Super Admin Top Banner Notice */}
      {user.role === 'superadmin' && (
        <div className="bg-[#2A2318] border-b border-[#C5A880]/40 text-[#E5C390] px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
            <span>Mode Super Admin Aktif · Terhubung ke PostgreSQL Supabase.</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-[#C5A880] text-[#121316] font-semibold px-3 py-1 rounded-sm hover:bg-[#d4b790] transition-colors cursor-pointer"
            >
              + Upload Parfum
            </button>
            <button
              onClick={() => setIsAnalyticsOpen(true)}
              className="bg-[#2A2318] hover:bg-[#342b1e] border border-[#C5A880] text-[#E5C390] px-3 py-1 rounded-sm flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics Dashboard</span>
            </button>
            <button
              onClick={() => setIsAdminSuggestionOpen(true)}
              className="bg-[#1A1C21] border border-[#C5A880] text-[#E5C390] font-semibold px-3 py-1 rounded-sm hover:bg-[#252830] transition-colors cursor-pointer"
            >
              Kelola Saran & Kritik
            </button>
            <button
              onClick={() => setIsUserManagementOpen(true)}
              className="bg-[#1A1C21] border border-[#C5A880] text-[#E5C390] font-semibold px-3 py-1 rounded-sm hover:bg-[#252830] transition-colors cursor-pointer"
            >
              Kelola User
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

      {/* Navbar Header */}
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

      {/* Konten Halaman */}
      <main className="flex-1">
        {currentPage === 'dashboard' && (
          <HeroSection
            onExploreVoting={() => setCurrentPage('katalog')}
            onExploreWinners={() => setCurrentPage('winners')}
            totalVotesCount={totalVotesAcrossAll}
          />
        )}

        {currentPage === 'winners' && (
          <TopWinnersSection
            winners={currentWinners}
            onOpenShopeeCheckout={(fragrance, selectedSize) => {
              setShopeeCheckout({ fragrance, size: selectedSize });
            }}
            onOpenFragranceDetail={(fragrance) => setDetailFragrance(fragrance)}
          />
        )}

        {currentPage === 'katalog' && (
          <VotingArenaSection
            fragrances={filteredFragrances}
            votedIds={user.votedIds}
            maxVotes={user.maxVotes}
            onToggleVote={handleToggleVote}
            onOpenFragranceDetail={(fragrance) => setDetailFragrance(fragrance)}
            onOpenWriteReview={(fragrance) => setReviewFragrance(fragrance)}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
            currentUser={user}
            onEditFragrance={(frag) => {
              setEditingFragrance(frag);
              setIsUploadModalOpen(true);
            }}
            onDeleteFragrance={handleDeleteFragrance}
          />
        )}

        {currentPage === 'kritik' && (
          <KritikSaranSection
            suggestions={suggestions}
            onUpvoteSuggestion={handleUpvoteSuggestion}
            onSubmitSuggestion={handleSubmitSuggestion}
            user={user}
          />
        )}
      </main>

      {/* Footer */}
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

      <UserManagementModal
        isOpen={isUserManagementOpen}
        onClose={() => setIsUserManagementOpen(false)}
        registeredUsers={registeredUsers}
        onDeleteUser={handleDeleteUser}
        currentUser={user}
      />

      <AdminAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        fragrances={fragrances}
        users={registeredUsers}
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
        onUpdateUser={async (updated) => {
          setUser(updated);
          handleRegisterOrUpdateUser(updated);

          const success = await upsertUserToDB(updated);
          if (success) {
            showToast(`Berhasil masuk & tersimpan: ${updated.name}`);
          } else {
            showToast(`Berhasil masuk, tetapi gagal sinkron ke DB.`);
          }
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
          setIsAdminOpen(false);
          setIsUploadModalOpen(true);
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