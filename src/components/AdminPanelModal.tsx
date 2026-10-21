import React from 'react';
import { X, ShieldCheck, Lock, RotateCcw } from 'lucide-react';
import { Fragrance, UserProfile } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  fragrances: Fragrance[];
  onResetCycleVotes: () => void;
  onLockWinners: () => void;
  cycleNumber: number;
  currentUser: UserProfile;
  onSelectFragranceForEdit?: (fragrance: Fragrance) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  fragrances,
  onResetCycleVotes,
  onLockWinners,
  cycleNumber,
  currentUser,
  onSelectFragranceForEdit,
}) => {
  if (!isOpen || currentUser.role !== 'superadmin') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#17191E] border border-[#C5A880]/50 rounded-sm shadow-2xl my-8 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#26282E] bg-[#121316]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            <div>
              <h3 className="text-base font-serif text-[#F3F0EA]">
                Sniff Society Super Admin Control Center
              </h3>
              <p className="text-xs text-[#8F9098]">
                Manajemen Siklus #{cycleNumber} & Daftar Kandidat (Klik nama parfum untuk mengedit link Shopee)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

          {/* Aksi Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onLockWinners}
              className="p-4 bg-[#231E18] hover:bg-[#2C2415] border border-[#C5A880]/40 rounded-sm flex items-center gap-3 text-left transition-colors cursor-pointer group"
            >
              <div className="p-2.5 rounded-sm bg-[#17191E] border border-[#C5A880]/30 text-[#C5A880]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F3F0EA] group-hover:text-[#C5A880]">
                  Kunci Top 3 Siklus Ini
                </h4>
                <p className="text-[11px] text-[#A1A1AA]">
                  Kunci pemenang mingguan dan picu simulasi notifikasi WhatsApp.
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Mulai cycle baru dan reset seluruh suara vote ke 0?')) {
                  onResetCycleVotes();
                }
              }}
              className="p-4 bg-[#1A1C21] hover:bg-[#22252C] border border-[#2E3138] rounded-sm flex items-center gap-3 text-left transition-colors cursor-pointer group"
            >
              <div className="p-2.5 rounded-sm bg-[#121316] border border-[#2E3138] text-[#A1A1AA]">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F3F0EA] group-hover:text-[#C5A880]">
                  Reset Vote (Mulai Cycle Baru)
                </h4>
                <p className="text-[11px] text-[#A1A1AA]">
                  Mengatur ulang seluruh perolehan suara komunitas ke angka 0.
                </p>
              </div>
            </button>
          </div>

          {/* Daftar Kandidat */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Daftar Kandidat Aktif ({fragrances.length}) — Klik Nama untuk Edit Shopee
            </h4>
            <div className="space-y-2">
              {fragrances.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (onSelectFragranceForEdit) {
                      onSelectFragranceForEdit(item);
                    }
                  }}
                  className="p-3 bg-[#121316] border border-[#26282E] hover:border-[#C5A880]/50 rounded-sm flex items-center justify-between gap-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#71717A] w-6">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#8F9098] block">
                        {item.brand}
                      </span>
                      <h5 className="text-xs font-semibold text-[#F3F0EA] group-hover:text-[#C5A880] transition-colors underline decoration-dotted underline-offset-4">
                        {item.name}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-xs font-bold font-mono text-[#C5A880] block">
                        {item.votes} votes
                      </span>
                      <span className="text-[10px] text-[#71717A]">{item.gender}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};