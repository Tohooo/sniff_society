import React from 'react';
import { MessageCircle, Instagram, Video } from 'lucide-react'; // Atau kita gunakan SVG kustom yang lebih akurat di bawah

interface FooterProps {
  onNavigate: (page: 'dashboard' | 'winners' | 'katalog' | 'kritik') => void;
  onOpenHowItWorks?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#121316] border-t border-[#26282E] text-[#A1A1AA] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#26282E]">

          {/* Kolom Brand & Social Media */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-sm font-serif font-bold text-[#F3F0EA] tracking-widest">
              SNIFF SOCIETY
            </h3>
            <p className="text-xs text-[#8F9098] leading-relaxed">
              Platform kurasi decant parfum otentik pertama di Indonesia yang ditenagai suara publik.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* WhatsApp */}
              <a
                href="https://wa.me/6281586663182"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Sniff Society"
                className="w-8 h-8 rounded-full bg-[#1A1C21] border border-[#2E3138] flex items-center justify-center text-[#A1A1AA] hover:text-[#25D366] hover:border-[#25D366] transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/riannn.py/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Sniff Society"
                className="w-8 h-8 rounded-full bg-[#1A1C21] border border-[#2E3138] flex items-center justify-center text-[#A1A1AA] hover:text-[#E1306C] hover:border-[#E1306C] transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@riannn.py"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Sniff Society"
                className="w-8 h-8 rounded-full bg-[#1A1C21] border border-[#2E3138] flex items-center justify-center text-[#A1A1AA] hover:text-[#ff0050] hover:border-[#ff0050] transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links / Eksplorasi Platform */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#F3F0EA] font-semibold">
              Eksplorasi Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('winners')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  Top 3 Winners
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('katalog')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  Katalog Parfum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kritik')}
                  className="hover:text-[#C5A880] transition-colors cursor-pointer text-left"
                >
                  Kritik & Saran
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom Standar Laboratorium */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#F3F0EA] font-semibold">
              Standar Laboratorium
            </h4>
            <ul className="space-y-2 text-xs text-[#8F9098]">
              <li>Botol Kaca Borosilikat Tebal</li>
              <li>Syringe Decanted Tanpa Udara</li>
              <li>Segal Parafilm Medis Anti Rembes</li>
            </ul>
          </div>

          {/* Kolom Info */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#F3F0EA] font-semibold">
              Legal & Informasi
            </h4>
            <p className="text-xs text-[#8F9098]">
              © 2026 Sniff Society Atelier Indonesia. Seluruh hak cipta dilindungi.
            </p>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71717A]">
          <span>Jakarta · Paris · London</span>
          <span>© 2026 Sniff Society</span>
        </div>
      </div>
    </footer>
  );
};