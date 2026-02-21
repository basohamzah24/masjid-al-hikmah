# 🕌 Masjid Keuangan

Sistem Manajemen Keuangan Masjid yang dibuat menggunakan Next.js 14, TypeScript, Prisma, dan Tailwind CSS.

## 📁 Struktur Folder

```
masjid-keuangan/
│
├── prisma/
│   ├── schema.prisma          # Schema database Prisma
│   └── seed.ts               # File untuk seed data awal
│
├── src/
│   ├── app/                  # App Router Next.js 14
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Halaman utama
│   │   │
│   │   ├── dashboard/        # Halaman dashboard
│   │   │   └── page.tsx
│   │   │
│   │   ├── pemasukan/        # Module pemasukan
│   │   │   ├── page.tsx
│   │   │   └── actions.ts    # Server actions
│   │   │
│   │   ├── pengeluaran/      # Module pengeluaran
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   │
│   │   ├── buka-puasa/       # Module buka puasa
│   │   │   ├── page.tsx
│   │   │   └── actions.ts
│   │   │
│   │   └── api/              # API routes
│   │       └── health/
│   │           └── route.ts
│   │
│   ├── components/           # Komponen React
│   │   ├── Navbar.tsx        # Navigasi utama
│   │   ├── Sidebar.tsx       # Sidebar menu
│   │   ├── Table.tsx         # Komponen tabel
│   │   ├── Card.tsx          # Komponen kartu
│   │   └── forms/            # Form components
│   │       ├── FormPemasukan.tsx
│   │       ├── FormPengeluaran.tsx
│   │       └── FormBukaPuasa.tsx
│   │
│   ├── lib/                  # Library dan utilities
│   │   ├── prisma.ts         # Konfigurasi Prisma client
│   │   ├── db.ts             # Database utilities
│   │   └── utils.ts          # Utility functions
│   │
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── styles/               # CSS styles
│       └── globals.css       # Global styles dengan Tailwind
│
├── .env                      # Environment variables
├── package.json              # Dependencies dan scripts
└── tsconfig.json            # TypeScript configuration
```

## 🚀 Cara Instalasi

1. **Clone repositori**
   ```bash
   git clone <url-repo>
   cd masjid-keuangan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   - Buat database PostgreSQL (atau MySQL)
   - Copy `.env.example` ke `.env`
   - Atur `DATABASE_URL` di file `.env`

4. **Jalankan migrasi database**
   ```bash
   npm run db:migrate
   ```

5. **Seed data awal (opsional)**
   ```bash
   npm run db:seed
   ```

6. **Jalankan development server**
   ```bash
   npm run dev
   ```

7. **Buka aplikasi**
   - Akses http://localhost:3000

## 📝 Scripts NPM

- `npm run dev` - Jalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Jalankan production server
- `npm run lint` - Jalankan ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema ke database (dev)
- `npm run db:migrate` - Jalankan migrasi database
- `npm run db:studio` - Buka Prisma Studio
- `npm run db:seed` - Jalankan seed data

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL dengan Prisma ORM
- **Form Handling**: React Server Actions
- **Development**: ESLint, Prettier

## 📊 Fitur Utama

### 1. Dashboard
- Ringkasan keuangan keseluruhan
- Grafik pemasukan dan pengeluaran
- Data transaksi terbaru

### 2. Manajemen Pemasukan
- Pencatatan infaq, sedekah, zakat
- Kategorisasi sumber dana
- Laporan pemasukan

### 3. Manajemen Pengeluaran
- Pencatatan pengeluaran operasional
- Kategorisasi pengeluaran
- Laporan pengeluaran

### 4. Modul Buka Puasa
- Pencatatan donatur buka puasa
- Tracking status pembayaran
- Manajemen data donatur

## 🔧 Konfigurasi Environment

Buat file `.env` dengan variabel berikut:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/masjid_keuangan"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

## 📱 Responsive Design

Aplikasi ini dibuat dengan pendekatan mobile-first dan responsive di semua perangkat.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repositori
2. Buat branch fitur (`git checkout -b feature/fitur-baru`)
3. Commit perubahan (`git commit -m 'Menambah fitur baru'`)
4. Push ke branch (`git push origin feature/fitur-baru`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License.

## 📧 Kontak

Untuk pertanyaan atau saran, silakan hubungi pengembang.

---

**Dibuat dengan ❤️ untuk kemudahan pengelolaan keuangan masjid**
