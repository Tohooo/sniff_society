import React, { useState } from 'react';
import { X, ShieldCheck, Trash2, MessageSquareText, CheckCircle2 } from 'lucide-react';
import { Suggestion, UserProfile } from '../types';

interface AdminSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestions: Suggestion[];
    onDeleteSuggestion: (id: string) => void;
    onUpdateSuggestionStatus: (id: string, status: Suggestion['status']) => void;
    onReplySuggestion: (id: string, replyText: string) => void;
    currentUser: UserProfile;
}

export const AdminSuggestionModal: React.FC<AdminSuggestionModalProps> = ({
    isOpen,
    onClose,
    suggestions,
    onDeleteSuggestion,
    onUpdateSuggestionStatus,
    onReplySuggestion,
    currentUser,
}) => {
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    if (!isOpen || currentUser.role !== 'superadmin') return null;

    const handleSendReply = (id: string) => {
        if (!replyText.trim()) return;
        onReplySuggestion(id, replyText.trim());
        setReplyText('');
        setReplyingId(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-[#17191E] border border-[#C5A880]/50 rounded-sm shadow-2xl my-8 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#26282E] bg-[#121316]">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                        <div>
                            <h3 className="text-base font-serif text-[#F3F0EA]">
                                Panel Moderasi Kritik & Saran (Super Admin)
                            </h3>
                            <p className="text-xs text-[#8F9098]">
                                Kelola status, berikan balasan resmi tim, atau hapus aspirasi komunitas
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Tutup"
                        className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138] cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List Aspirasi */}
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
                    {suggestions.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-8">Belum ada kritik atau saran yang masuk.</p>
                    ) : (
                        suggestions.map((item) => (
                            <div key={item.id} className="p-4 bg-[#121316] border border-[#26282E] rounded-sm space-y-3">

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA] mb-1">
                                            <span className="text-[#C5A880] font-semibold">{item.category}</span>
                                            <span>·</span>
                                            <span>Oleh: {item.author}</span>
                                            <span>·</span>
                                            <span>{item.date}</span>
                                        </div>
                                        <h4 className="text-sm font-semibold text-[#F3F0EA]">{item.title}</h4>
                                        <p className="text-xs text-[#A1A1AA] mt-1">{item.description}</p>
                                    </div>

                                    {/* Tombol Hapus */}
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Hapus saran "${item.title}"?`)) {
                                                onDeleteSuggestion(item.id);
                                            }
                                        }}
                                        className="p-2 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 rounded-sm border border-rose-900 cursor-pointer transition-colors"
                                        title="Hapus Aspirasi"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Kontrol Status & Balasan */}
                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#26282E] text-xs">

                                    {/* Ubah Status */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-[11px]">Status:</span>
                                        <select
                                            value={item.status}
                                            onChange={(e) => onUpdateSuggestionStatus(item.id, e.target.value as Suggestion['status'])}
                                            className="py-1 px-2.5 bg-[#1A1C21] border border-[#2E3138] text-xs text-[#C5A880] rounded-sm outline-none cursor-pointer"
                                        >
                                            <option value="Dalam Review">Dalam Review</option>
                                            <option value="Direncanakan">Direncanakan</option>
                                            <option value="Diterapkan">Diterapkan</option>
                                        </select>
                                    </div>

                                    {/* Tombol Balas */}
                                    <button
                                        onClick={() => setReplyingId(replyingId === item.id ? null : item.id)}
                                        className="text-xs text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <MessageSquareText className="w-3.5 h-3.5" />
                                        <span>{item.adminReply ? 'Edit Balasan Tim' : 'Beri Balasan Resmi'}</span>
                                    </button>
                                </div>

                                {/* Tampilan Balasan Aktif / Input Balasan */}
                                {item.adminReply && replyingId !== item.id && (
                                    <div className="p-2.5 bg-[#1A1D24] border border-[#C5A880]/30 rounded-sm text-xs space-y-1">
                                        <span className="text-[10px] text-[#C5A880] uppercase tracking-wider block font-semibold">Respon Tim Atelier Sniff Society</span>
                                        <p className="text-gray-300">{item.adminReply}</p>
                                    </div>
                                )}

                                {replyingId === item.id && (
                                    <div className="space-y-2 pt-2">
                                        <textarea
                                            rows={2}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Tulis balasan resmi tim di sini..."
                                            className="w-full p-2.5 bg-[#17191E] border border-[#2E3138] text-xs text-[#F3F0EA] rounded-sm outline-none focus:border-[#C5A880]"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setReplyingId(null)}
                                                className="px-3 py-1.5 bg-[#1A1C21] text-gray-400 text-xs rounded-sm cursor-pointer"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                onClick={() => handleSendReply(item.id)}
                                                className="px-3 py-1.5 bg-[#C5A880] text-[#121316] font-semibold text-xs rounded-sm cursor-pointer"
                                            >
                                                Kirim Balasan
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};