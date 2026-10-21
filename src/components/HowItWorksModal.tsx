import React from 'react';
import { X, CheckCircle, Droplets, Clock, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#17191E] border border-[#2E3138] rounded-sm shadow-2xl my-8 overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#26282E] bg-[#121316]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              The Sniff Society Manifesto
            </span>
            <h3 className="text-xl font-serif text-[#F3F0EA]">
              Cara Kerja & Standar Laboratorium Decant
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Cara Kerja"
            className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* 4 Steps Journey */}
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-[#121316] border border-[#24262C] rounded-sm">
              <div className="w-8 h-8 rounded-sm bg-[#2A2318] border border-[#C5A880] text-[#E5C390] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                01
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#F3F0EA]">
                  Voting Komunitas (3 Suara Per Anggota)
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Setiap minggu, Anda memiliki 3 hak suara gratis. Jelajahi piramida aroma di FragDB, pilih parfum niche impian Anda, dan ubah alokasi suara Anda kapan saja sebelum batas waktu penutupan.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-[#121316] border border-[#24262C] rounded-sm">
              <div className="w-8 h-8 rounded-sm bg-[#2A2318] border border-[#C5A880] text-[#E5C390] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                02
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#F3F0EA]">
                  Penutupan Siklus & WhatsApp Alert
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Pada hari Minggu pukul 23:59 WIB, voting dikunci. 3 parfum dengan suara terbanyak diumumkan secara otomatis ke nomor WhatsApp anggota yang terdaftar.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-[#121316] border border-[#24262C] rounded-sm">
              <div className="w-8 h-8 rounded-sm bg-[#2A2318] border border-[#C5A880] text-[#E5C390] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                03
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#F3F0EA]">
                  Repack Syringe Tanpa Paparan Udara
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Kami tidak menyemprot manual (yang merusak top notes). Parfum diekstraksi langsung dari botol flacon menggunakan syringe steril tertutup ke dalam vial kaca borosilikat dengan seal parafilm anti-bocor.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-[#121316] border border-[#24262C] rounded-sm">
              <div className="w-8 h-8 rounded-sm bg-[#2A2318] border border-[#C5A880] text-[#E5C390] flex items-center justify-center font-serif font-bold text-sm shrink-0">
                04
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-[#F3F0EA]">
                  Checkout Aman di Shopee Official Store
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Top 3 winners langsung tersedia di etalase Shopee dalam ukuran 2ml, 3ml, 5ml, dan 10ml lengkap dengan kartu sertifikasi Batch Code resmi dan voucher diskon mingguan.
                </p>
              </div>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="p-4 bg-[#1C1E24] border border-[#C5A880]/40 rounded-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E5C390]">
              <ShieldCheck className="w-4 h-4" />
              <span>Jaminan Keaslian Seumur Hidup Sniff Society:</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Jika terbukti tidak asli, uang Anda kami kembalikan 500%. Kami hanya membeli botol flacon resmi dari butik resmi Paris, London, New York, dan distributor resmi bersertifikat.
            </p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Saya Mengerti, Mulai Vote
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
