import React from 'react';
import { X, Users, Trash2, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface UserManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
    registeredUsers: UserProfile[];
    onDeleteUser: (email: string) => void;
    currentUser: UserProfile;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
    isOpen,
    onClose,
    registeredUsers,
    onDeleteUser,
    currentUser,
}) => {
    if (!isOpen || currentUser.role !== 'superadmin') return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#17191E] border border-[#C5A880]/50 rounded-sm shadow-2xl my-8 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[#26282E] bg-[#121316]">
                    <div className="flex items-center gap-2.5">
                        <Users className="w-5 h-5 text-[#C5A880]" />
                        <div>
                            <h3 className="text-base font-serif text-[#F3F0EA]">
                                Manajemen Akun Pengguna (Super Admin)
                            </h3>
                            <p className="text-xs text-[#8F9098]">
                                Daftar akun anggota dan tamu yang terdaftar di platform Sniff Society
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

                {/* Body List */}
                <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                    {registeredUsers.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[#71717A]">
                            Belum ada akun pengguna terdaftar.
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {registeredUsers.map((usr) => (
                                <div
                                    key={usr.email}
                                    className="p-4 bg-[#121316] border border-[#26282E] rounded-sm flex items-center justify-between gap-4 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-[#F3F0EA]">
                                                {usr.name}
                                            </span>
                                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded-sm font-mono ${usr.role === 'superadmin'
                                                    ? 'bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40'
                                                    : 'bg-[#22252C] text-[#A1A1AA]'
                                                }`}>
                                                {usr.role}
                                            </span>
                                        </div>
                                        <div className="text-xs text-[#8F9098] font-mono">
                                            {usr.email} · WhatsApp: {usr.phone || '-'}
                                        </div>
                                    </div>

                                    {/* Tombol Hapus Akun */}
                                    {usr.email !== currentUser.email && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Hapus akun "${usr.name}" (${usr.email}) dari sistem?`)) {
                                                    onDeleteUser(usr.email);
                                                }
                                            }}
                                            className="p-2 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 rounded-sm transition-colors cursor-pointer"
                                            title="Hapus Akun"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="p-4 bg-[#121316] border-t border-[#26282E] flex items-center gap-2 text-[11px] text-[#8F9098]">
                    <ShieldAlert className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>Super Admin memiliki hak penuh untuk memoderasi atau menghapus akun pengguna yang melanggar aturan.</span>
                </div>

            </div>
        </div>
    );
};