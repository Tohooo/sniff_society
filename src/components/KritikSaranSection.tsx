import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Send, CheckCircle2, Clock, Lightbulb, Sparkles } from 'lucide-react';
import { Suggestion, UserProfile } from '../types';

interface KritikSaranSectionProps {
  suggestions: Suggestion[];
  onUpvoteSuggestion: (id: string) => void;
  onSubmitSuggestion: (newSug: Omit<Suggestion, 'id' | 'upvotes' | 'date'>) => void;
  user: UserProfile;
}

export const KritikSaranSection: React.FC<KritikSaranSectionProps> = ({
  suggestions,
  onUpvoteSuggestion,
  onSubmitSuggestion,
  user,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [activeStatus, setActiveStatus] = useState<string>('Semua');

  // Submission Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Suggestion['category']>('Request Parfum');
  const [submittedAlert, setSubmittedAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmitSuggestion({
      author: user.name || 'Member Komunitas',
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'in_review',
    });

    setTitle('');
    setDescription('');
    setIsSubmitting(false);
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 4000);
  };

  const filteredSuggestions = suggestions.filter((item) => {
    if (activeCategory !== 'Semua' && item.category !== activeCategory) return false;
    if (activeStatus !== 'Semua' && item.status !== activeStatus) return false;
    return true;
  });

  const getStatusBadge = (status: Suggestion['status']) => {
    if (status === 'implemented') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#14291E] border border-[#25D366]/40 text-[#25D366] text-[11px] font-medium rounded-sm">
          <CheckCircle2 className="w-3 h-3" />
          <span>Diterapkan</span>
        </span>
      );
    }
    if (status === 'planned') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#2B2315] border border-[#C5A880]/40 text-[#E5C390] text-[11px] font-medium rounded-sm">
          <Clock className="w-3 h-3" />
          <span>Direncanakan</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#1C1E24] border border-[#3A3D46] text-[#A1A1AA] text-[11px] font-medium rounded-sm">
        <Lightbulb className="w-3 h-3" />
        <span>Dalam Review</span>
      </span>
    );
  };

  return (
    <section id="kritik-saran" className="py-20 lg:py-28 bg-[#15171C] border-b border-[#26282E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Header and Action to Submit */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#26282E]">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-medium">
              Community Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F3F0EA]">
              Papan Kritik, Saran & Request Parfum
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-xl">
              Platform Sniff Society dibangun bersama para pencinta aroma niche di Indonesia.
              Kirimkan request parfum yang ingin Anda nominasikan, kritik kualitas packaging decant,
              atau ide fitur baru.
            </p>
          </div>

          <button
            onClick={() => setIsSubmitting(!isSubmitting)}
            className="px-5 py-3 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] text-xs font-semibold uppercase tracking-[0.15em] rounded-sm transition-all self-start md:self-auto cursor-pointer"
          >
            {isSubmitting ? 'Tutup Formulir' : '+ Tulis Ide / Request Baru'}
          </button>
        </div>

        {/* Success Alert */}
        {submittedAlert && (
          <div className="p-4 bg-[#14291E] border border-[#25D366] text-[#25D366] text-xs rounded-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Terima kasih! Saran Anda telah berhasil dipublikasikan ke papan komunitas.</span>
          </div>
        )}

        {/* Submission Form Modal/Panel */}
        {isSubmitting && (
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-[#1A1C21] border border-[#C5A880]/50 rounded-sm space-y-4 animate-fadeIn"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#2E3138]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F3F0EA]">
                Kirim Ide atau Request Parfum
              </h3>
              <span className="text-xs text-[#8F9098]">Diposting sebagai: {user.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#A1A1AA]">Kategori Aspirasi</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Suggestion['category'])}
                  className="w-full py-2.5 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                >
                  <option value="Request Parfum">Request Parfum Niche Baru</option>
                  <option value="Packaging & Botol">Packaging & Botol Atomizer</option>
                  <option value="Sistem Voting">Sistem & Fitur Voting</option>
                  <option value="Layanan Shopee">Layanan & Pengiriman Shopee</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#A1A1AA]">Judul Singkat Aspirasi</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Request decant Amouage Guidance untuk cycle depan"
                  className="w-full py-2.5 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-[#A1A1AA]">Penjelasan Detail & Alasan</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan mengapa parfum atau fitur ini penting untuk komunitas Sniff Society..."
                className="w-full py-2.5 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitting(false)}
                className="px-4 py-2 bg-[#121316] text-[#A1A1AA] hover:text-white text-xs rounded-sm border border-[#2E3138]"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#C5A880] text-[#121316] hover:bg-[#b8986d] text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publikasikan Aspirasi</span>
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#71717A] uppercase tracking-wider mr-2">Kategori:</span>
            {['Semua', 'Request Parfum', 'Packaging & Botol', 'Sistem Voting', 'Layanan Shopee'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-sm border transition-colors ${activeCategory === cat
                    ? 'bg-[#C5A880] text-[#121316] border-[#C5A880] font-medium'
                    : 'bg-[#181A1F] text-[#A1A1AA] border-[#2A2D35] hover:border-[#52525B]'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#71717A] uppercase tracking-wider">Status:</span>
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="py-1 px-2.5 bg-[#181A1F] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
            >
              <option value="Semua">Semua Status</option>
              <option value="in_review">Dalam Review</option>
              <option value="planned">Direncanakan</option>
              <option value="implemented">Diterapkan</option>
            </select>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSuggestions.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-[#1A1C21] border border-[#26282E] hover:border-[#383C45] rounded-sm space-y-4 flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">

                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[#C5A880] font-medium">{item.category}</span>
                    <span className="text-[#52525B]">·</span>
                    <span className="text-[#71717A]">{item.date}</span>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>

                {/* Title */}
                <h4 className="text-base font-medium text-[#F3F0EA] leading-snug">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {item.description}
                </p>

                {/* Official Atelier Response if exists */}
                {item.adminReply && (
                  <div className="p-3 bg-[#131418] border-l-2 border-[#C5A880] rounded-r-sm space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#C5A880] font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>Respon Tim Atelier Sniff Society</span>
                    </div>
                    <p className="text-[#C4C4CC] leading-relaxed italic text-[11px]">
                      "{item.adminReply}"
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with Upvote Button */}
              <div className="flex items-center justify-between pt-3 border-t border-[#26282E] text-xs">
                <span className="text-[#71717A]">
                  Oleh: <strong className="text-[#C4C4CC] font-normal">{item.author}</strong>
                </span>

                <button
                  onClick={() => onUpvoteSuggestion(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-colors cursor-pointer ${item.userUpvoted
                      ? 'bg-[#2A2318] border-[#C5A880] text-[#E5C390]'
                      : 'bg-[#121316] border-[#2A2D35] text-[#A1A1AA] hover:text-white'
                    }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${item.userUpvoted ? 'fill-current' : ''}`} />
                  <span className="font-mono tabular-nums font-semibold">{item.upvotes}</span>
                  <span className="text-[11px]">{item.userUpvoted ? 'Didukung' : 'Dukung'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
