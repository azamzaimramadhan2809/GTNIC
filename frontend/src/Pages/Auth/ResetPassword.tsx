import { useMemo, useState, type FormEvent } from 'react';
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Store } from 'lucide-react';
import { api, message } from '../../api';

export default function ResetPassword() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const token = params.get('token') ?? '';
  const email = params.get('email') ?? '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const goToLogin = () => {
    window.history.replaceState({}, '', '/login');
    window.location.reload();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!token || !email) {
      setError('Tautan reset password tidak lengkap. Minta tautan baru dari halaman login.');
      return;
    }
    if (password.length < 8) {
      setError('Password baru minimal 8 karakter.');
      return;
    }
    if (password !== confirmation) {
      setError('Konfirmasi password belum sama.');
      return;
    }

    setLoading(true);
    try {
      await api<{ message: string }>('/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirmation,
        }),
      });
      setSuccess(true);
    } catch (caught) {
      setError(message(caught));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 flex items-center justify-center">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="bg-gradient-to-br from-emerald-800 via-[#057A55] to-emerald-950 px-7 py-8 text-white">
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#057A55] shadow-lg">
              <Store size={23} strokeWidth={2.4} />
            </span>
            <div>
              <p className="font-bold tracking-tight">WarungPintar</p>
              <p className="text-xs text-emerald-100">Digital POS & Inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <KeyRound size={24} />
            </span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Buat password baru</h1>
              <p className="mt-1 text-sm text-emerald-100">Amankan kembali akses akun tokomu.</p>
            </div>
          </div>
        </div>

        <div className="p-7">
          {success ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 text-emerald-600" size={54} />
              <h2 className="text-xl font-bold text-slate-900">Password berhasil diubah</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Silakan masuk memakai password baru untuk melanjutkan.</p>
              <button type="button" onClick={goToLogin} className="mt-6 w-full rounded-xl bg-[#057A55] px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">
                Kembali ke Login
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email akun</label>
                <input value={email} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-600 outline-none" />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Password baru</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required autoComplete="new-password" placeholder="Minimal 8 karakter" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-11 text-sm outline-none transition focus:border-[#057A55] focus:bg-white focus:ring-2 focus:ring-[#057A55]/20" />
                  <button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#057A55]">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">Ulangi password baru</label>
                <input type={showPassword ? 'text' : 'password'} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={8} required autoComplete="new-password" placeholder="Ketik sekali lagi" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-[#057A55] focus:bg-white focus:ring-2 focus:ring-[#057A55]/20" />
              </div>

              {error && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700 ring-1 ring-red-100">{error}</p>}

              <button disabled={loading} className="w-full rounded-xl bg-[#057A55] px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
              <button type="button" onClick={goToLogin} className="flex w-full items-center justify-center gap-2 py-1 text-sm font-semibold text-slate-500 hover:text-[#057A55]">
                <ArrowLeft size={16} /> Kembali ke Login
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
