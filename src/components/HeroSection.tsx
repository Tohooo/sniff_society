import React, { useEffect, useState } from 'react';
import { ArrowDownRight, Clock, Award, Droplets, Sparkles } from 'lucide-react';
import { calculateRemainingTime } from '../utils/votingEngine';

// Daftar gambar dari assets untuk efek slideshow bergerak di background
import heroBg1 from '../assets/images/hero_scentcraft_atelier_1792550616899.jpg';
import heroBg2 from '../assets/images/perfume_baccarat_crimson_1792550618912.jpg';
import heroBg3 from '../assets/images/perfume_aventus_silver_1792550619996.jpg';
import heroBg4 from '../assets/images/perfume_noir_amber_1792550618181.jpg';
import heroBg5 from '../assets/images/perfume_santal_apothecary_1792550618901.jpg';

const backgroundImages = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5];

interface HeroSectionProps {
  onExploreVoting: () => void;
  onExploreWinners: () => void;
  totalVotesCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreVoting,
  onExploreWinners,
  totalVotesCount,
}) => {
  // State untuk indeks gambar latar belakang yang aktif
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Efek berganti foto secara otomatis setiap 4 detik dengan transisi halus
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  // Cycle deadline set to Sunday 23:59 (e.g. 2 days, 14 hours ahead)
  const [deadline] = useState(() => Date.now() + (2 * 24 + 14) * 3600 * 1000 + 22 * 60 * 1000);
  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateRemainingTime(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <section className="relative overflow-hidden border-b border-[#26282E] bg-[#121316]">
      {/* Background atelier slideshow backdrop dengan efek transisi & scrim */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity pointer-events-none">
        {backgroundImages.map((imgSrc, index) => (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={`Sniff Society Atelier Laboratory ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            referrerPolicy="no-referrer"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-[#121316]/70 to-[#121316]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl space-y-6">

          {/* Subtle cycle indicator with live timer */}
          <div className="inline-flex items-center gap-3 px-3.5 py-1.5 bg-[#1B1D22]/80 border border-[#2E3138] rounded-sm text-xs text-[#C5A880] tracking-wider uppercase font-medium">
            <span className="flex h-2 w-2 relative">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A880]" />
            </span>
            <span>Cycle #48 Voting Terbuka</span>
            <span className="text-[#52525B]">|</span>
            <div className="flex items-center gap-1 font-mono tabular-nums text-[#F3F0EA]">
              <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>
                {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Luxury Editorial Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#F3F0EA] leading-[1.12] text-balance">
            Demokratisasi Niche Fragrance. <br />
            <span className="italic text-[#C5A880] font-light">Dipilih Komunitas,</span> Didecant Sempurna.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#A1A1AA] font-normal leading-relaxed max-w-2xl text-pretty">
            Platform kurasi decant parfum otentik pertama di Indonesia yang ditenagai suara publik.
            Gunakan hak suara mingguan Anda untuk menentukan parfum niche dunia yang akan dibotolkan
            dalam ukuran 2ml, 3ml, 5ml, hingga 10ml dan siap di-checkout via Shopee.
          </p>

          {/* CTA Button Strip */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onExploreVoting}
              className="px-6 py-3.5 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all shadow-lg shadow-[#C5A880]/10 flex items-center gap-2 group cursor-pointer"
            >
              <span>Gunakan 3 Vote Anda</span>
              <ArrowDownRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </button>

            <button
              onClick={onExploreWinners}
              className="px-6 py-3.5 bg-[#1A1C21] hover:bg-[#22252C] text-[#F3F0EA] hover:text-[#C5A880] border border-[#2E3138] text-xs font-semibold uppercase tracking-[0.18em] rounded-sm transition-all cursor-pointer"
            >
              Lihat Top 3 Siap Kirim
            </button>
          </div>
        </div>

        {/* 3 Pillar Trust Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 mt-8 border-t border-[#26282E]/80">

          <div className="flex items-start gap-4 p-5 rounded-sm bg-[#181A1F]/60 border border-[#26282E]">
            <div className="p-2.5 rounded-sm bg-[#121316] border border-[#2E3138] text-[#C5A880] shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wide text-[#F3F0EA]">
                Decant Syringe Tanpa Udara
              </h3>
              <p className="text-xs text-[#8F9098] leading-relaxed">
                Menggunakan jarum syringe steril khusus parfum. Formula asli terjaga tanpa oksidasi atau kontak udara luar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-sm bg-[#181A1F]/60 border border-[#26282E]">
            <div className="p-2.5 rounded-sm bg-[#121316] border border-[#2E3138] text-[#C5A880] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wide text-[#F3F0EA]">
                100% Authentic & Batch Verified
              </h3>
              <p className="text-xs text-[#8F9098] leading-relaxed">
                Setiap botol decant disertai nomor Batch Code resmi distributor Paris/NYC dan jaminan keaslian seumur hidup.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-sm bg-[#181A1F]/60 border border-[#26282E]">
            <div className="p-2.5 rounded-sm bg-[#121316] border border-[#2E3138] text-[#C5A880] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold tracking-wide text-[#F3F0EA]">
                Total {totalVotesCount.toLocaleString()} Suara Komunitas
              </h3>
              <p className="text-xs text-[#8F9098] leading-relaxed">
                Voting diperbarui secara real-time. Tentukan 1 pilihan terbaik Anda sebelum penutupan siklus.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};