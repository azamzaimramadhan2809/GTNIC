# NexaSmart REST API

Base URL lokal: `http://127.0.0.1:8000/api`

Gunakan header berikut pada semua endpoint yang dilindungi:

```text
Accept: application/json
Content-Type: application/json
Authorization: Bearer <token>
```

## Authentication

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/register` | Daftar dan menerima token |
| POST | `/login` | Login dan menerima token |
| POST | `/forgot-password` | Kirim tautan reset password |
| POST | `/reset-password` | Simpan password baru |
| GET | `/user` | Profil pengguna aktif |
| POST | `/logout` | Cabut token aktif |

## Warung dan inventori

| Method | Endpoint | Keterangan |
|---|---|---|
| GET/POST | `/warungs` | Daftar/buat warung |
| GET/PATCH/DELETE | `/warungs/{warung}` | Detail/ubah/hapus warung |
| GET/POST | `/warungs/{warung}/ingredient-categories` | Daftar/buat kategori |
| GET/PATCH/DELETE | `/warungs/{warung}/ingredient-categories/{category}` | Detail/ubah/hapus kategori |
| GET/POST | `/warungs/{warung}/ingredients` | Daftar/buat bahan |
| GET/PATCH/DELETE | `/warungs/{warung}/ingredients/{ingredient}` | Detail/ubah/hapus bahan |
| GET/POST | `/warungs/{warung}/stock-movements` | Riwayat/penyesuaian stok |
| GET | `/warungs/{warung}/stock-movements/{stockMovement}` | Detail perubahan stok |

Filter bahan: `?search=beras`, `?category_id=1`, dan `?low_stock=true`.

Registrasi menerima nomor HP opsional melalui field `phone`. Login dapat tetap
memakai field `email` untuk kompatibilitas, atau field `login` yang berisi email
atau nomor HP.

Harga beli bahan disimpan pada field `purchase_price` dan dinyatakan per unit
bahan yang dipilih.

Contoh penyesuaian stok:

```json
{
  "ingredient_id": 1,
  "type": "purchase",
  "quantity": 5000,
  "note": "Pembelian beras 5 kg"
}
```

## Menu dan resep

| Method | Endpoint | Keterangan |
|---|---|---|
| GET/POST | `/warungs/{warung}/menus` | Daftar/buat menu |
| GET/PATCH/DELETE | `/warungs/{warung}/menus/{menu}` | Detail/ubah/hapus menu |
| PUT | `/warungs/{warung}/menus/{menu}/recipe` | Ganti resep menu |
| GET/POST | `/warungs/{warung}/menu-categories` | Daftar/buat kategori menu |
| GET/PATCH/DELETE | `/warungs/{warung}/menu-categories/{menuCategory}` | Kelola kategori menu |

Daftar menu mendukung `?search=nasi`, `?category_id=1`, dan
`?available=true`. Menu menerima `menu_category_id` opsional.

Contoh resep:

```json
{
  "ingredients": [
    {"ingredient_id": 1, "quantity": 200},
    {"ingredient_id": 2, "quantity": 1}
  ]
}
```

## POS dan pembayaran

| Method | Endpoint | Keterangan |
|---|---|---|
| GET/POST | `/warungs/{warung}/sales` | Riwayat/buat transaksi |
| GET | `/warungs/{warung}/sales/{sale}` | Detail transaksi |
| POST | `/warungs/{warung}/sales/{sale}/cancel` | Batalkan transaksi dan kembalikan stok |

Contoh transaksi tunai:

```json
{
  "items": [
    {"menu_id": 1, "quantity": 2}
  ],
  "discount": 2000,
  "tax": 1000,
  "payment": {
    "method": "cash",
    "received_amount": 50000
  }
}
```

Metode pembayaran: `cash`, `qris`, `transfer`, atau `card`. Harga, subtotal,
total, kembalian, dan kebutuhan bahan dihitung oleh server. Transaksi ditolak
jika menu tidak tersedia, belum memiliki resep, atau stok tidak mencukupi.

## Pengeluaran dan dashboard

| Method | Endpoint | Keterangan |
|---|---|---|
| GET/POST | `/warungs/{warung}/expenses` | Daftar/buat pengeluaran |
| GET/PATCH/DELETE | `/warungs/{warung}/expenses/{expense}` | Detail/ubah/hapus pengeluaran |
| GET | `/warungs/{warung}/dashboard` | Ringkasan usaha |

Endpoint penjualan dan pengeluaran menerima filter `date_from` dan `date_to`
dengan format `YYYY-MM-DD`. Dashboard memakai periode hari ini secara default
dan dapat diberi filter tanggal yang sama. Field `estimated_cogs` menghitung
estimasi modal bahan, sedangkan `estimated_profit` menghitung omzet dikurangi
modal bahan dan pengeluaran.

## Kode respons utama

| Status | Arti |
|---|---|
| 200 | Berhasil |
| 201 | Data berhasil dibuat |
| 401 | Token tidak ada atau tidak valid |
| 404 | Data tidak ditemukan atau bukan milik user aktif |
| 409 | Operasi ditolak karena data masih digunakan |
| 422 | Validasi atau aturan bisnis gagal |
