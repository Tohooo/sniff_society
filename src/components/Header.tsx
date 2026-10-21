import React, { useState } from 'react';
import { Bell, ShieldCheck, User, Menu, X, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  currentPage: string;
  onNavigate: (page: any) => void;
  onOpenAuth: () => void;
  onOpenWA: () => void;
  onOpenHowItWorks: () => void;
  onOpenAdmin: () => void;
  remainingVotes: number;
  totalVotesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentPage,
  onNavigate,
  onOpenAuth,
  onOpenWA,
  onOpenHowItWorks,
  onOpenAdmin,
  remainingVotes,
  totalVotesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#121316]/90 backdrop-blur-md border-b border-[#26282E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly 3 zones Top Bar Contract */}
        <div className="flex items-center justify-between gap-2 sm:gap-6 lg:gap-8 h-20">

          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-lg sm:text-2xl font-serif tracking-[0.18em] sm:tracking-[0.2em] font-bold text-[#F3F0EA] hover:text-[#C5A880] transition-colors whitespace-nowrap bg-transparent border-none cursor-pointer text-left"
            >
              SNIFF SOCIETY
            </button>
            <span className="hidden md:inline-block text-[10px] tracking-[0.25em] uppercase text-[#A1A1AA] border-l border-[#2E3138] pl-3">
              Atelier de Décant
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.15em] text-[#A1A1AA] font-medium">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`hover:text-[#F3F0EA] transition-colors whitespace-nowrap py-1 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#C5A880] after:transition-all ${currentPage === 'dashboard' ? 'text-[#C5A880] font-bold' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('winners')}
              className={`hover:text-[#F3F0EA] transition-colors whitespace-nowrap py-1 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#C5A880] after:transition-all ${currentPage === 'winners' ? 'text-[#C5A880] font-bold' : ''}`}
            >
              Top 3 Winners
            </button>
            <button
              onClick={() => onNavigate('katalog')}
              className={`hover:text-[#F3F0EA] transition-colors whitespace-nowrap py-1 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#C5A880] after:transition-all ${currentPage === 'katalog' ? 'text-[#C5A880] font-bold' : ''}`}
            >
              Katalog Parfum
            </button>
            <button
              onClick={() => onNavigate('kritik')}
              className={`hover:text-[#F3F0EA] transition-colors whitespace-nowrap py-1 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#C5A880] after:transition-all ${currentPage === 'kritik' ? 'text-[#C5A880] font-bold' : ''}`}
            >
              Kritik & Saran
            </button>
            <button
              onClick={onOpenHowItWorks}
              className="hover:text-[#F3F0EA] transition-colors whitespace-nowrap text-left py-1 cursor-pointer"
            >
              Cara Kerja
            </button>
          </nav>

          {/* Zone 3: Interactive Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* WhatsApp Alert Bell Button */}
            <button
              onClick={onOpenWA}
              aria-label="Notifikasi WhatsApp Pemenang Mingguan"
              className="relative p-2 rounded-full text-[#A1A1AA] hover:text-[#C5A880] bg-[#1A1C21] hover:bg-[#22252C] border border-[#2E3138] transition-all cursor-pointer"
              title="Simulasi WhatsApp Alert"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#25D366] rounded-full ring-2 ring-[#121316]" />
            </button>

            {/* Admin Access Quick Trigger if SuperAdmin */}
            {user.role === 'superadmin' && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#C5A880] bg-[#2A2318] border border-[#C5A880]/40 rounded-sm hover:bg-[#342b1e] transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden md:inline">Admin</span>
              </button>
            )}

            {/* Voting Allocation Indicator Badge & User Account Trigger */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#F3F0EA] bg-[#1A1C21] hover:bg-[#22252C] border border-[#2E3138] rounded-sm transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span className="font-mono tabular-nums text-[#C5A880] text-[11px] sm:text-xs">
                {3 - remainingVotes}/3
              </span>
              <div className="h-3 w-[1px] bg-[#2E3138]" />
              <User className="w-3.5 h-3.5 text-[#A1A1AA]" />
              <span className="hidden sm:inline capitalize">{user.role}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 lg:hidden text-[#A1A1AA] hover:text-white cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#181A1F] border-b border-[#26282E] px-6 py-4 space-y-3">
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }}
            className="block w-full text-left text-sm uppercase tracking-wider text-[#A1A1AA] hover:text-white py-1 cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('winners'); }}
            className="block w-full text-left text-sm uppercase tracking-wider text-[#A1A1AA] hover:text-white py-1 cursor-pointer"
          >
            Top 3 Winners
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('katalog'); }}
            className="block w-full text-left text-sm uppercase tracking-wider text-[#A1A1AA] hover:text-white py-1 cursor-pointer"
          >
            Katalog Parfum
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onNavigate('kritik'); }}
            className="block w-full text-left text-sm uppercase tracking-wider text-[#A1A1AA] hover:text-white py-1 cursor-pointer"
          >
            Kritik & Saran
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenHowItWorks();
            }}
            className="block w-full text-left text-sm uppercase tracking-wider text-[#A1A1AA] hover:text-white py-1 cursor-pointer"
          >
            Cara Kerja & Jaminan
          </button>
          {user.role === 'superadmin' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="block w-full text-left text-sm uppercase tracking-wider text-[#C5A880] py-1 cursor-pointer"
            >
              Buka Super Admin Panel
            </button>
          )}
        </div>
      )}
    </header>
  );
};
