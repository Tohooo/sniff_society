import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, CheckCircle2, ArrowRight, UserPlus, KeyRound, ArrowLeft, LogOut, Phone } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

interface RegisteredUser {
  email: string;
  phone: string;
  password: string;
  name: string;
}

// Konfigurasi Akun Super Admin Bawaan
const SUPER_ADMIN = {
  email: 'admin@sniffsociety.id',
  phone: '08211413989',
  password: 'adminpassword123',
  role: 'superadmin' as const,
  name: 'Admin Sniff Society',
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUser, setPendingUser] = useState<RegisteredUser | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLoggedIn = currentUser.role !== 'guest';

  // Ambil database user dari localStorage
  const getStoredUsers = (): RegisteredUser[] => {
    const data = localStorage.getItem('sniff_society_db_users');
    return data ? JSON.parse(data) : [];
  };

  const saveStoredUsers = (users: RegisteredUser[]) => {
    localStorage.setItem('sniff_society_db_users', JSON.stringify(users));
  };

  // 1. Handler Login dengan Validasi Ketat DB
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Email dan password wajib diisi.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // Cek apakah Super Admin
      if (
        email.toLowerCase() === SUPER_ADMIN.email.toLowerCase() &&
        password === SUPER_ADMIN.password
      ) {
        onUpdateUser({
          ...currentUser,
          role: 'superadmin',
          name: SUPER_ADMIN.name,
          email: SUPER_ADMIN.email,
          phone: SUPER_ADMIN.phone,
        });
        onClose();
        resetForm();
        return;
      }

      // Cek ke database localStorage user terdaftar
      const users = getStoredUsers();
      const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!foundUser) {
        setErrorMessage('Email belum terdaftar. Silakan daftar terlebih dahulu.');
        return;
      }

      if (foundUser.password !== password) {
        setErrorMessage('Password salah! Periksa kembali password Anda.');
        return;
      }

      // Login Sukses
      onUpdateUser({
        ...currentUser,
        role: 'member' as any,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
      });
      onClose();
      resetForm();
    }, 600);
  };

  // 2. Handler Pendaftaran (Cek Duplikasi & Kirim OTP Interaktif)
  const handleRegisterRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !phone || !password || !confirmPassword) {
      setErrorMessage('Semua kolom wajib diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password dan konfirmasi password tidak sama.');
      return;
    }

    // Cek apakah email sudah terdaftar di Super Admin atau Database Lokal
    if (email.toLowerCase() === SUPER_ADMIN.email.toLowerCase()) {
      setErrorMessage('Email ini sudah terdaftar sebagai Administrator.');
      return;
    }

    const users = getStoredUsers();
    const isExist = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (isExist) {
      setErrorMessage('Email ini sudah terdaftar! Gunakan email lain atau langsung masuk.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Generate 4 digit OTP unik untuk email tujuan
      const mockOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(mockOtp);
      setPendingUser({ email, phone, password, name: `Member (${email.split('@')[0]})` });

      setIsLoading(false);
      setViewMode('otp');
      setSuccessMessage(`Kode OTP berhasil dikirim ke email ${email}`);

      // Munculkan Alert interaktif berisi kode OTP asli agar user bisa langsung verifikasi
      alert(`[SIMULASI SERVER EMAIL SNIFF SOCIETY]\n\nKode OTP untuk verifikasi email (${email}) adalah: ${mockOtp}`);
    }, 1000);
  };

  // 3. Handler Verifikasi OTP & Simpan ke DB
  const handleVerifyRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otpCode !== generatedOtp) {
      setErrorMessage('Kode OTP salah! Periksa kembali kode yang dikirim ke email Anda.');
      return;
    }

    if (pendingUser) {
      const users = getStoredUsers();
      saveStoredUsers([...users, pendingUser]);

      onUpdateUser({
        ...currentUser,
        role: 'member' as any,
        name: pendingUser.name,
        email: pendingUser.email,
        phone: pendingUser.phone,
      });

      alert('Akun berhasil diverifikasi dan terdaftar!');
      onClose();
      resetForm();
    }
  };

  // 4. Handler Lupa Password
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Masukkan email akun Anda terlebih dahulu.');
      return;
    }

    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (email.toLowerCase() !== SUPER_ADMIN.email.toLowerCase() && !found) {
      setErrorMessage('Email tidak ditemukan dalam database kami.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Tautan pemulihan password telah dikirim ke email: ${email}`);
      alert(`[SIMULASI EMAIL PEMULIHAN]\n\nLink ubah password dikirim ke: ${email}`);
      setTimeout(() => {
        setSuccessMessage(null);
        setViewMode('login');
      }, 3500);
    }, 1000);
  };

  const resetForm = () => {
    setViewMode('login');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhone('');
    setOtpCode('');
    setPendingUser(null);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLogout = () => {
    onUpdateUser({
      ...currentUser,
      role: 'guest',
      name: 'Tamu Penikmat Aroma',
      email: 'guest@sniffsociety.id',
      phone: '081289201928',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#17191E] border border-[#C5A880]/50 rounded-sm shadow-2xl p-6 text-[#F3F0EA]">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#26282E] mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            <h3 className="text-base font-serif text-[#F3F0EA]">
              {isLoggedIn ? 'Profil Akun Anda' : 'Masuk Akun Sniff Society'}
            </h3>
          </div>
          <button
            onClick={() => { onClose(); resetForm(); }}
            aria-label="Tutup"
            className="p-1.5 text-[#A1A1AA] hover:text-white bg-[#1A1C21] rounded-full border border-[#2E3138] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifikasi Error / Sukses */}
        {errorMessage && (
          <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 p-2.5 rounded-sm mb-4">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-sm mb-4">
            {successMessage}
          </div>
        )}

        {/* PROFIL / JIKA SUDAH LOGIN */}
        {isLoggedIn ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#121316] border border-[#26282E] rounded-sm space-y-3">

              {/* Tambahan Baris Nama */}
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Nama Akun</span>
                <div className="flex items-center gap-2 text-xs text-[#F3F0EA] font-semibold mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>{currentUser.name}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Email Terdaftar</span>
                <div className="flex items-center gap-2 text-xs text-[#F3F0EA] font-medium mt-0.5">
                  <Mail className="w-4 h-4 text-[#C5A880]" />
                  <span>{currentUser.email}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Nomor WhatsApp</span>
                <div className="flex items-center gap-2 text-xs text-[#F3F0EA] font-medium mt-0.5">
                  <Phone className="w-4 h-4 text-[#C5A880]" />
                  <span>{currentUser.phone || '-'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-rose-950/50 hover:bg-rose-900/50 border border-rose-800/60 text-rose-300 font-semibold py-2.5 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Log Out)</span>
            </button>
          </div>
        ) : (
          <>
            {/* VIEW 1: LOGIN FORM */}
            {viewMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2.5 pl-10 pr-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2.5 pl-10 pr-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] font-semibold py-2.5 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Memproses Masuk...' : 'Masuk'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
                  <button
                    type="button"
                    onClick={() => { setViewMode('forgot'); setErrorMessage(null); }}
                    className="hover:text-[#C5A880] underline cursor-pointer"
                  >
                    Lupa password?
                  </button>
                  <button
                    type="button"
                    onClick={() => { setViewMode('register'); setErrorMessage(null); }}
                    className="hover:text-[#C5A880] underline cursor-pointer"
                  >
                    Belum punya akun? Daftar
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 2: REGISTER FORM */}
            {viewMode === 'register' && (
              <form onSubmit={handleRegisterRequest} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="emailkamu@domain.com"
                    className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2 px-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2 px-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2 px-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Masukkan Password yang Sama</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2 px-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] font-semibold py-2.5 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors mt-2"
                >
                  {isLoading ? 'Memeriksa & Mengirim OTP...' : 'Daftar & Kirim OTP ke Email'}
                  <UserPlus className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setViewMode('login'); setErrorMessage(null); }}
                    className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Sudah punya akun? Masuk
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 3: FORGOT PASSWORD */}
            {viewMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-gray-300">
                  Masukkan alamat email terdaftar Anda. Kami akan mengirimkan instruksi untuk mengubah password Anda.
                </p>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email Terdaftar</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="emailkamu@domain.com"
                    className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2.5 px-3 text-xs text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] font-semibold py-2.5 rounded-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Memproses...' : 'Kirim Email Ubah Password'}
                  <KeyRound className="w-4 h-4" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setViewMode('login'); setErrorMessage(null); }}
                    className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Login
                  </button>
                </div>
              </form>
            )}

            {/* VIEW 4: VERIFIKASI OTP REGISTRASI */}
            {viewMode === 'otp' && (
              <form onSubmit={handleVerifyRegisterOtp} className="space-y-4">
                <div className="text-center bg-[#121316] p-4 rounded-sm border border-gray-800">
                  <CheckCircle2 className="w-8 h-8 text-[#C5A880] mx-auto mb-2" />
                  <p className="text-xs text-gray-300">
                    Kode OTP verifikasi telah dikirim ke email <strong className="text-white">{email}</strong>
                  </p>
                  <p className="text-[10px] text-amber-400 mt-1">
                    * Cek pop-up alert yang muncul di layar Anda untuk melihat kode OTP asli.
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Masukkan 4 Digit Kode OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-[#121316] border border-[#2E3138] rounded-sm py-2.5 px-3 text-sm font-mono tracking-widest text-center text-[#F3F0EA] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('register')}
                    className="w-1/3 bg-[#121316] hover:bg-gray-800 text-gray-300 text-xs py-2.5 rounded-sm border border-[#2E3138] cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-[#C5A880] hover:bg-[#b8986d] text-[#121316] font-semibold py-2.5 rounded-sm text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Verifikasi & Daftar
                  </button>
                </div>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
};