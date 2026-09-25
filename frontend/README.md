# LynkStore

Aplikasi full-stack Next.js untuk storefront UMKM, dashboard merchant, autentikasi, katalog, dan analytics. Database, Auth, dan Storage memakai Supabase.

## Menjalankan aplikasi

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Isi `.env.local` dengan **Project URL** dan **Publishable key** dari Supabase Project Settings → API. Jangan pernah menaruh secret/service-role key di variabel `NEXT_PUBLIC_*`.

## Menyiapkan Supabase

1. Buat project Supabase dan aktifkan Data API.
2. Isi `.env.local`.
3. Login Supabase CLI lalu tautkan project:

```bash
npx supabase login
npx supabase link --project-ref PROJECT_REF
npx supabase db push
```

Migration membuat tabel `profiles`, `stores`, `products`, `analytics_events`, RLS lengkap, trigger profil, index, serta bucket `store-assets`.

4. Di Authentication → URL Configuration, isi Site URL `http://localhost:3000` dan redirect URL `http://localhost:3000/auth/callback`.
5. Untuk Google Login, aktifkan provider Google dan isi Client ID/Secret.
6. Untuk WhatsApp OTP, aktifkan Phone provider dan konfigurasi Twilio/Twilio Verify. Supabase hanya mendukung channel WhatsApp lewat kedua provider tersebut.

Cek koneksi setelah migration:

```text
http://localhost:3000/api/supabase-health
```

Respons yang benar adalah `{"configured":true,"connected":true}`.

## Mode demo autentikasi

Selama pengembangan, `NEXT_PUBLIC_DEMO_AUTH=true` membuat login dan register menerima data uji apa pun, melewati proteksi route, dan menyimpan toko secara lokal. Saat autentikasi asli akan dipakai, ubah menjadi:

```env
NEXT_PUBLIC_DEMO_AUTH=false
```

Setelah mengubah nilainya, restart server Next.js. Kode email/password, Google OAuth, dan WhatsApp OTP tetap tersedia dan otomatis digunakan ketika mode demo dimatikan.

## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm run build
```
