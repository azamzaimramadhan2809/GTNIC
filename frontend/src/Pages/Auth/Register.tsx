import { useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
} from 'lucide-react';
import { api, message } from '../../api';

interface RegisterResponse {
  message: string;
  email: string;
  requires_verification: boolean;
}

export default function Register() {
  const [ownerName, setOwnerName] = useState('');
  const [warungName, setWarungName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.');
      return;
    }
    if (password !== confirmation) {
      setError('Konfirmasi kata sandi belum sama.');
      return;
    }

    setLoading(true);
    try {
      const result = await api<RegisterResponse>('/register', {
        method: 'POST',
        body: JSON.stringify({
          name: ownerName,
          warung_name: warungName,
          email,
          phone,
          password,
          password_confirmation: confirmation,
        }),
      });
      setRegisteredEmail(result.email);
    } catch (caught) {
      setError(message(caught));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 lg:grid lg:grid-cols-[0.85fr_1.15fr]">
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-950 via-[#057A55] to-emerald-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#057A55] shadow-lg">
            <Store size={23} strokeWidth={2.4} />
          </span>
          <div>
            <p className="font-extrabold tracking-tight">WarungPintar</p>
            <p className="text-xs text-emerald-100">Digital POS & Inventory</p>
          </div>
        </div>

        <div className="relative max-w-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Mulai kelola usaha</p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">Satu akun untuk kasir, stok, dan laporan warungmu.</h1>
          <p className="mt-5 text-sm leading-7 text-emerald-100/90">Daftarkan pemilik dan nama warung. Dashboard akan langsung siap setelah pendaftaran selesai.</p>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-emerald-100/80">
          <ShieldCheck size={16} /> Data akun disimpan dengan aman
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#057A55]">Pendaftaran gratis</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">Daftar Warung Baru</h2>
              <p className="mt-1 text-sm text-slate-500">Lengkapi informasi pemilik dan usaha.</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#057A55] lg:hidden">
              <Store size={22} />
            </span>
          </div>

          {registeredEmail ? (
            <div className="py-6 text-center">
              <CheckCircle2 className="mx-auto text-emerald-600" size={56} />
              <h3 className="mt-4 text-xl font-extrabold text-slate-900">Periksa Gmail kamu</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Kami mengirim tautan verifikasi ke <strong className="text-slate-700">{registeredEmail}</strong>. Klik tautannya sebelum login.
              </p>
              <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#057A55] px-4 py-3 text-sm font-bold text-white hover:bg-emerald-800">
                Buka Gmail <ArrowRight size={16} />
              </a>
              <a href="/login" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#057A55]">
                <ArrowLeft size={16} /> Kembali ke Login
              </a>
            </div>
          ) : <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama pemilik" icon={<UserRound size={16} />}>
                <input required value={ownerName} onChange={(event) => setOwnerName(event.target.value)} autoComplete="name" placeholder="Contoh: Budi Santoso" className="form-input" />
              </Field>
              <Field label="Nama warung" icon={<Store size={16} />}>
                <input required value={warungName} onChange={(event) => setWarungName(event.target.value)} placeholder="Contoh: Warung Berkah" className="form-input" />
              </Field>
            </div>

            <Field label="Gmail" icon={<Mail size={16} />}>
              <input required type="email" pattern=".+@gmail[.]com" value={email} onChange={(event) => setEmail(event.target.value.toLowerCase())} autoComplete="email" placeholder="nama@gmail.com" className="form-input" />
            </Field>

            <Field label="Nomor WhatsApp" icon={<Phone size={16} />}>
              <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" placeholder="08123456789" className="form-input" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Kata sandi" icon={<LockKeyhole size={16} />}>
                <input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" placeholder="Minimal 8 karakter" className="form-input pr-10" />
                <button type="button" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} onClick={() => setShowPassword((shown) => !shown)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#057A55]">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </Field>
              <Field label="Ulangi kata sandi" icon={<LockKeyhole size={16} />}>
                <input required minLength={8} type={showPassword ? 'text' : 'password'} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" placeholder="Ketik sekali lagi" className="form-input" />
              </Field>
            </div>

            {error && <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700 ring-1 ring-red-100">{error}</p>}

            <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#057A55] px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
              {loading ? 'Membuat akun...' : <>Daftar dan Buka Dashboard <ArrowRight size={16} /></>}
            </button>
          </form>}

          {!registeredEmail && <a href="/login" className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#057A55]">
            <ArrowLeft size={16} /> Sudah punya akun? Masuk
          </a>}
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        {children}
      </span>
    </label>
  );
}
