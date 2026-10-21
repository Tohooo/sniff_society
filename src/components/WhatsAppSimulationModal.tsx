import React, { useState } from 'react';
import { X, Send, Bell, CheckCheck, Sparkles, ShoppingBag, PhoneCall, ExternalLink } from 'lucide-react';
import { Fragrance, UserProfile } from '../types';

interface WhatsAppSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  winners: Fragrance[];
  user: UserProfile;
  onUpdatePhone: (phone: string) => void;
}

export const WhatsAppSimulationModal: React.FC<WhatsAppSimulationModalProps> = ({
  isOpen,
  onClose,
  winners,
  user,
  onUpdatePhone,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '081289201928');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSent, setSimulationSent] = useState(false);

  if (!isOpen) return null;

  const top3 = winners.slice(0, 3);

  const handleSendSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    onUpdatePhone(phoneNumber);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationSent(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#17191E] border border-[#2E3138] rounded-sm shadow-2xl my-8 overflow-hidden animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#26282E] bg-[#121316]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1A3326] text-[#25D366] rounded-full border border-[#25D366]/40">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif text-[#F3F0EA]">
                Simulasi WhatsApp Notifikasi Mingguan
              </h3>
              <p className="text-xs text-[#8F9098]">
                Pengingat otomatis saat Top 3 Pemenang dikunci & siap di-checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Notifikasi WhatsApp"
            className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Phone Form */}
          <form onSubmit={handleSendSimulation} className="p-4 bg-[#121316] border border-[#2E3138] rounded-sm space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[#A1A1AA] font-medium">Nomor WhatsApp Member:</label>
              <span className="text-[11px] text-[#25D366]">✓ Terdaftar Notifikasi Harian</span>
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="flex-1 py-2 px-3 bg-[#1A1C21] border border-[#2E3138] focus:border-[#25D366] text-sm font-mono text-[#F3F0EA] rounded-sm outline-none"
              />
              <button
                type="submit"
                disabled={isSimulating}
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-[#121316] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSimulating ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Uji Kirim WA</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#71717A]">
              *Sistem mengirim notifikasi gratis setiap Minggu malam begitu voting ditutup.
            </p>
          </form>

          {/* Interactive Simulated WhatsApp Chat Window */}
          <div className="rounded-sm border border-[#26282E] bg-[#0C1317] overflow-hidden shadow-inner">

            {/* WhatsApp App Bar */}
            <div className="bg-[#1F2C34] px-4 py-3 flex items-center justify-between text-white border-b border-[#2A3942]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center font-serif text-sm font-bold text-white">
                  SC
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#E9EDEF]">
                    <span>Sniff Society Atelier Official</span>
                    <span className="text-[#25D366] text-[10px]">●</span>
                  </div>
                  <div className="text-[10px] text-[#8696A0]">Official Decant Bot · Online</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#8696A0]">20:00 WIB</span>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] min-h-[220px]">

              <div className="flex justify-center">
                <span className="px-2.5 py-0.5 rounded-sm bg-[#182229] text-[10px] text-[#8696A0] uppercase tracking-wider">
                  Hari ini · Notifikasi Siklus Voting #48
                </span>
              </div>

              {/* Incoming Bubble */}
              <div className="max-w-[90%] bg-[#202C33] text-[#D1D7DB] rounded-lg rounded-tl-none p-3.5 space-y-2.5 border border-[#2A3942] shadow-sm text-xs">
                <div className="font-semibold text-[#25D366] flex items-center gap-1 text-[11px]">
                  <Sparkles className="w-3 h-3" />
                  <span>[Sniff Society DECANTS] HASIL TOP 3 TELAH TERKUNCI!</span>
                </div>

                <p className="leading-relaxed text-[11.5px]">
                  Halo Kak <strong className="text-white">{user.name}</strong>! Pilihan suara komunitas Anda untuk Cycle #48 telah selesai direkapitulasi:
                </p>

                <div className="p-2.5 bg-[#111B21] rounded border border-[#2A3942] space-y-1 font-mono text-[11px] text-[#E9EDEF]">
                  {top3.map((win, idx) => (
                    <div key={win.id} className="flex justify-between py-0.5">
                      <span>#{idx + 1}. {win.brand} {win.name}</span>
                      <strong className="text-[#C5A880]">{win.votes} v</strong>
                    </div>
                  ))}
                </div>

                <p className="leading-relaxed text-[11.5px]">
                  🔬 Tim lab kami sedang membotolkan syringe decant batch pertama (vial 2ml, 3ml, 5ml, 10ml).
                </p>

                <div className="p-2 bg-[#2A3942]/60 rounded text-[11px] text-[#00A884] font-medium flex items-center justify-between">
                  <span>Voucher Shopee: <strong>SCENTWEEK48</strong></span>
                  <span className="text-white text-[10px]">Potongan Rp 15.000</span>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-[#8696A0]">
                  <span className="underline text-[#53BDEB]">shopee.co.id/Sniff Society_decants</span>
                  <div className="flex items-center gap-1 text-[#53BDEB]">
                    <span>20:00</span>
                    <CheckCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-xs text-[#A1A1AA] hover:text-white underline"
            >
              Tutup Simulasi
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
