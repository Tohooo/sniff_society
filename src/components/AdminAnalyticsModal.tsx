import React, { useMemo } from 'react';
import { X, BarChart3, TrendingUp, Users, Award, ShieldCheck, Flame } from 'lucide-react';
import { Fragrance, UserProfile } from '../types';

interface AdminAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    fragrances: Fragrance[];
    users: UserProfile[];
}

export const AdminAnalyticsModal: React.FC<AdminAnalyticsModalProps> = ({
    isOpen,
    onClose,
    fragrances,
    users,
}) => {
    // 1. Hitung total suara dan parfum teratas
    const totalVotes = useMemo(() => {
        return fragrances.reduce((sum, f) => sum + (f.votes || 0), 0);
    }, [fragrances]);

    const topVotedFragrance = useMemo(() => {
        if (fragrances.length === 0) return null;
        return [...fragrances].sort((a, b) => b.votes - a.votes)[0];
    }, [fragrances]);

    // 2. Hitung statistik Notes yang paling sering muncul di katalog/vote
    const noteStats = useMemo(() => {
        const topCount: Record<string, number> = {};
        const midCount: Record<string, number> = {};
        const baseCount: Record<string, number> = {};

        fragrances.forEach((f) => {
            f.notes?.top?.forEach((n) => {
                topCount[n] = (topCount[n] || 0) + (f.votes || 1);
            });
            f.notes?.mid?.forEach((n) => {
                midCount[n] = (midCount[n] || 0) + (f.votes || 1);
            });
            f.notes?.base?.forEach((n) => {
                baseCount[n] = (baseCount[n] || 0) + (f.votes || 1);
            });
        });

        const getTopNote = (dict: Record<string, number>) => {
            const sorted = Object.entries(dict).sort((a, b) => b[1] - a[1]);
            return sorted.length > 0 ? sorted[0][0] : '-';
        };

        return {
            top: getTopNote(topCount),
            mid: getTopNote(midCount),
            base: getTopNote(baseCount),
        };
    }, [fragrances]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-[#17191E] border border-[#C5A880]/50 rounded-sm shadow-2xl my-8 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#26282E] bg-[#121316]">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
                        <div>
                            <h3 className="text-base font-serif text-[#F3F0EA]">
                                Super Admin Analytics & Statistics Dashboard
                            </h3>
                            <p className="text-xs text-[#8F9098]">
                                Laporan performa siklus voting, tren aroma komunitas, dan data anggota real-time
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

                {/* Body Content */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

                    {/* Ringkasan Kartu Statistik Utama */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#121316] border border-[#2E3138] rounded-sm space-y-2">
                            <div className="flex items-center justify-between text-[#8F9098]">
                                <span className="text-xs uppercase tracking-wider">Total Partisipasi Suara</span>
                                <TrendingUp className="w-4 h-4 text-[#C5A880]" />
                            </div>
                            <div className="text-2xl font-serif text-[#F3F0EA]">{totalVotes} Suara</div>
                            <div className="text-[11px] text-[#25D366]">Akumulasi seluruh kandidat siklus aktif</div>
                        </div>

                        <div className="p-4 bg-[#121316] border border-[#2E3138] rounded-sm space-y-2">
                            <div className="flex items-center justify-between text-[#8F9098]">
                                <span className="text-xs uppercase tracking-wider">Total Anggota Terdaftar</span>
                                <Users className="w-4 h-4 text-[#C5A880]" />
                            </div>
                            <div className="text-2xl font-serif text-[#F3F0EA]">{users.length} Member</div>
                            <div className="text-[11px] text-[#C5A880]">Sesi aktif real-time</div>
                        </div>

                        <div className="p-4 bg-[#121316] border border-[#2E3138] rounded-sm space-y-2">
                            <div className="flex items-center justify-between text-[#8F9098]">
                                <span className="text-xs uppercase tracking-wider">Kandidat Terfavorit</span>
                                <Award className="w-4 h-4 text-[#C5A880]" />
                            </div>
                            <div className="text-lg font-serif text-[#F3F0EA] truncate">
                                {topVotedFragrance ? `${topVotedFragrance.brand} - ${topVotedFragrance.name}` : '-'}
                            </div>
                            <div className="text-[11px] text-[#E5C390]">
                                Memimpin dengan {topVotedFragrance?.votes || 0} suara
                            </div>
                        </div>
                    </div>

                    {/* Analisis Notes Paling Diminati Komunitas */}
                    <div className="p-5 bg-[#121316] border border-[#26282E] rounded-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-[#C5A880]" />
                            <h4 className="text-sm font-serif text-[#F3F0EA]">Komposisi Notes Paling Dominan Pilihan Komunitas</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-3 bg-[#181A1F] border border-[#23252B] rounded-sm space-y-1">
                                <span className="text-[10px] uppercase text-[#71717A]">Top Notes Terfavorit</span>
                                <div className="text-sm font-semibold text-[#E5C390]">{noteStats.top}</div>
                            </div>
                            <div className="p-3 bg-[#181A1F] border border-[#23252B] rounded-sm space-y-1">
                                <span className="text-[10px] uppercase text-[#71717A]">Middle Notes Terfavorit</span>
                                <div className="text-sm font-semibold text-[#E5C390]">{noteStats.mid}</div>
                            </div>
                            <div className="p-3 bg-[#181A1F] border border-[#23252B] rounded-sm space-y-1">
                                <span className="text-[10px] uppercase text-[#71717A]">Base Notes Terfavorit</span>
                                <div className="text-sm font-semibold text-[#E5C390]">{noteStats.base}</div>
                            </div>
                        </div>
                    </div>

                    {/* Grafik Perolehan Suara Per Kandidat */}
                    <div className="p-5 bg-[#121316] border border-[#26282E] rounded-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#C5A880]" />
                                <h4 className="text-sm font-serif text-[#F3F0EA]">Distribusi Perolehan Suara Kandidat Saat Ini</h4>
                            </div>
                            <span className="text-xs font-mono text-[#8F9098]">Cycle #48</span>
                        </div>

                        <div className="space-y-3 pt-2">
                            {fragrances.map((item) => {
                                const percentage = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
                                return (
                                    <div key={item.id} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-[#F3F0EA] font-medium">{item.brand} - {item.name}</span>
                                            <span className="text-[#C5A880] font-mono">{item.votes} Suara ({percentage}%)</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#1A1C21] rounded-full overflow-hidden border border-[#2E3138]">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#C5A880] to-[#E5C390] rounded-full transition-all duration-500"
                                                style={{ width: `${Math.max(3, percentage)}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Footer Modal */}
                <div className="flex items-center justify-end p-4 border-t border-[#26282E] bg-[#121316]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                        Tutup Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
};