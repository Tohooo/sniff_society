import React, { useState } from 'react';
import { X, Star, CheckCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import { Fragrance, Review, UserProfile } from '../types';

interface ReviewModalProps {
  fragrance: Fragrance | null;
  reviews: Review[];
  onClose: () => void;
  onSubmitReview: (review: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
  user: UserProfile;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  fragrance,
  reviews,
  onClose,
  onSubmitReview,
  user,
}) => {
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [longevityRating, setLongevityRating] = useState<Review['longevityRating']>('Long Lasting (8-10h)');
  const [sillageRating, setSillageRating] = useState<Review['sillageRating']>('Strong');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Aroma Mewah', 'Packaging Rapi']);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!fragrance) return null;

  const fragranceReviews = reviews.filter((r) => r.fragranceId === fragrance.id);

  const availableTags = [
    'Aroma Mewah',
    'Awet 14 Jam',
    'Packaging Rapi',
    'Decant Otentik',
    'Office Safe',
    'Compliment Getter',
    'Date Night',
    'Blind Buy Safe',
    'Projection Kuat',
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmitReview({
      fragranceId: fragrance.id,
      fragranceName: `${fragrance.brand} ${fragrance.name}`,
      author: user.name || 'Member Terdaftar',
      rating,
      longevityRating,
      sillageRating,
      comment: comment.trim(),
      tags: selectedTags,
      verifiedDecantBuyer: true,
    });

    setComment('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('read');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#17191E] border border-[#2E3138] rounded-sm shadow-2xl my-8 overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#26282E] bg-[#121316]">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#C5A880]">
              {fragrance.brand}
            </span>
            <h3 className="text-xl font-serif text-[#F3F0EA]">
              Ulasan & Rating: {fragrance.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Review"
            className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#26282E] bg-[#14161A] text-xs">
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 py-3 font-medium uppercase tracking-wider text-center border-b-2 transition-colors ${
              activeTab === 'read'
                ? 'border-[#C5A880] text-[#E5C390] bg-[#1A1C21]'
                : 'border-transparent text-[#71717A] hover:text-white'
            }`}
          >
            Semua Review ({fragranceReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-3 font-medium uppercase tracking-wider text-center border-b-2 transition-colors ${
              activeTab === 'write'
                ? 'border-[#C5A880] text-[#E5C390] bg-[#1A1C21]'
                : 'border-transparent text-[#71717A] hover:text-white'
            }`}
          >
            + Tulis Ulasan Pengalaman
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          
          {submittedSuccess && (
            <div className="p-4 bg-[#14291E] border border-[#25D366] text-[#25D366] text-xs rounded-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Review Anda berhasil dipublikasikan! Terima kasih atas kontribusi Anda.</span>
            </div>
          )}

          {activeTab === 'read' ? (
            <div className="space-y-4">
              {fragranceReviews.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <MessageSquare className="w-8 h-8 text-[#52525B] mx-auto" />
                  <p className="text-sm text-[#A1A1AA]">
                    Belum ada ulasan untuk decant ini. Jadilah yang pertama membagikan pengalaman Anda!
                  </p>
                  <button
                    onClick={() => setActiveTab('write')}
                    className="px-4 py-2 bg-[#C5A880] text-[#121316] text-xs font-semibold rounded-sm uppercase tracking-wider"
                  >
                    Tulis Review Sekarang
                  </button>
                </div>
              ) : (
                fragranceReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#121316] border border-[#24262C] rounded-sm space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#F3F0EA]">{rev.author}</span>
                        {rev.verifiedDecantBuyer && (
                          <span className="text-[10px] text-[#25D366] bg-[#14291E] px-2 py-0.5 rounded-sm border border-[#25D366]/30">
                            ✓ Pembeli Decant Terverifikasi
                          </span>
                        )}
                      </div>
                      <span className="text-[#71717A]">{rev.date}</span>
                    </div>

                    {/* Stars and performance */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex text-[#E5C390]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-[#3F3F46]'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[#52525B]">·</span>
                      <span className="text-[#A1A1AA]">Ketahanan: <strong className="text-white">{rev.longevityRating}</strong></span>
                      <span className="text-[#52525B]">·</span>
                      <span className="text-[#A1A1AA]">Sillage: <strong className="text-white">{rev.sillageRating}</strong></span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-[#C4C4CC] leading-relaxed">
                      {rev.comment}
                    </p>

                    {/* Tags */}
                    {rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {rev.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#1B1D22] border border-[#2E3138] text-[10px] text-[#A1A1AA] rounded-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Write Review Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Star Rating Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#A1A1AA] block">Beri Nilai Keseluruhan (1-5 Bintang):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-[#E5C390] fill-current'
                            : 'text-[#3F3F46]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-mono font-semibold text-[#E5C390]">
                    {hoverRating || rating} / 5 Bintang
                  </span>
                </div>
              </div>

              {/* Longevity & Sillage selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#A1A1AA]">Ketahanan pada Kulit Anda</label>
                  <select
                    value={longevityRating}
                    onChange={(e) => setLongevityRating(e.target.value as any)}
                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                  >
                    <option value="Eterna (12h+)">Eterna (12 Jam+)</option>
                    <option value="Long Lasting (8-10h)">Long Lasting (8-10 Jam)</option>
                    <option value="Moderate (4-6h)">Moderate (4-6 Jam)</option>
                    <option value="Intimate (2-4h)">Intimate / Lembut (2-4 Jam)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#A1A1AA]">Sillage / Pancaran Aroma</label>
                  <select
                    value={sillageRating}
                    onChange={(e) => setSillageRating(e.target.value as any)}
                    className="w-full py-2 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                  >
                    <option value="Enormous">Enormous (Mengisi Ruangan)</option>
                    <option value="Strong">Strong (1-2 Meter)</option>
                    <option value="Moderate">Moderate (Jarak Bicara)</option>
                    <option value="Intimate">Intimate (Skin Scent)</option>
                  </select>
                </div>
              </div>

              {/* Tags Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#A1A1AA] block">Pilih Karakter Aroma yang Dirasakan:</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-2.5 py-1 text-xs rounded-sm border transition-colors ${
                          isSelected
                            ? 'bg-[#2A2318] text-[#E5C390] border-[#C5A880]'
                            : 'bg-[#121316] text-[#A1A1AA] border-[#2A2D35]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Comment */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#A1A1AA]">Ulasan Pengalaman Pemakaian Decant</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan dry down aroma, performa spray decant, atau reaksi orang sekitar saat Anda memakai parfum ini..."
                  className="w-full py-2.5 px-3 bg-[#121316] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('read')}
                  className="px-4 py-2 bg-[#121316] text-[#A1A1AA] text-xs rounded-sm border border-[#2E3138]"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] text-xs font-semibold uppercase tracking-wider rounded-sm"
                >
                  Kirim Review Saya
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
