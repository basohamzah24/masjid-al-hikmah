// Types untuk Pemasukan
export interface Pemasukan {
  id: number;
  tanggal: Date;
  sumber: string;
  jumlah: number;
  kategori: string;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Types untuk Pengeluaran
export interface Pengeluaran {
  id: number;
  tanggal: Date;
  tujuan: string;
  jumlah: number;
  kategori: string;
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Types untuk Buka Puasa
export interface BukaPuasa {
  id: number;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  jumlah: number;
  tanggal: Date;
  status: 'pending' | 'lunas';
  keterangan: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Types untuk Kategori
export interface Kategori {
  id: number;
  nama: string;
  tipe: 'pemasukan' | 'pengeluaran';
  deskripsi: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Types untuk form input
export interface PemasukanInput {
  tanggal: string;
  sumber: string;
  jumlah: number;
  kategori: string;
  keterangan?: string;
}

export interface PengeluaranInput {
  tanggal: string;
  tujuan: string;
  jumlah: number;
  kategori: string;
  keterangan?: string;
}

export interface BukaPuasaInput {
  nama: string;
  alamat?: string;
  telepon?: string;
  jumlah: number;
  tanggal: string;
  keterangan?: string;
}

// Types untuk ringkasan keuangan
export interface RingkasanKeuangan {
  totalPemasukan: number;
  totalPengeluaran: number;
  totalBukaPuasa: number;
  saldo: number;
}

// Types untuk response API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Types untuk table props
export interface TableData {
  [key: string]: any;
}

// Types untuk form state
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  success: boolean;
}

// Types untuk filter dan sorting
export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  kategori?: string;
  search?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Enum untuk kategori
export enum KategoriPemasukan {
  INFAQ = 'infaq',
  SEDEKAH = 'sedekah',
  ZAKAT = 'zakat',
  DONASI = 'donasi',
  LAINNYA = 'lainnya',
}

export enum KategoriPengeluaran {
  OPERASIONAL = 'operasional',
  PEMELIHARAAN = 'pemeliharaan',
  KEGIATAN = 'kegiatan',
  KONSUMSI = 'konsumsi',
  SOSIAL = 'sosial',
  LAINNYA = 'lainnya',
}

export enum StatusBukaPuasa {
  PENDING = 'pending',
  LUNAS = 'lunas',
}

// Types untuk Laporan
export interface LaporanBulanan {
  bulan: string;
  tahun: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  totalBukaPuasa: number;
  saldo: number;
  jumlahTransaksiPemasukan: number;
  jumlahTransaksiPengeluaran: number;
  jumlahDonaturBukaPuasa: number;
}

export interface LaporanTahunan {
  tahun: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  totalBukaPuasa: number;
  saldo: number;
  jumlahTransaksiPemasukan: number;
  jumlahTransaksiPengeluaran: number;
  jumlahDonaturBukaPuasa: number;
  laporanPerBulan: LaporanBulanan[];
}

export interface StatistikKategori {
  kategori: string;
  jumlah: number;
  total: number;
  persentase: number;
}

export interface LaporanDetail {
  pemasukan: Array<{
    id: number;
    tanggal: Date;
    sumber: string;
    kategori: string;
    jumlah: number;
    keterangan: string | null;
  }>;
  pengeluaran: Array<{
    id: number;
    tanggal: Date;
    tujuan: string;
    kategori: string;
    jumlah: number;
    keterangan: string | null;
  }>;
  bukaPuasa: Array<{
    id: number;
    tanggal: Date;
    nama: string;
    alamat: string | null;
    telepon: string | null;
    keterangan: string | null;
    status: string;
  }>;
}

export interface RingkasanKeuanganKeseluruhan {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
  jumlahTransaksiPemasukan: number;
  jumlahTransaksiPengeluaran: number;
  jumlahDonaturBukaPuasa: number;
}

// Types untuk Laporan Ramadhan
export interface RamadhanFinancialReport {
  summary: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    incomeCount: number;
    expenseCount: number;
  };
  income: Array<{
    id: number;
    tanggal: Date;
    sumber: string;
    kategori: string;
    jumlah: number;
    keterangan: string | null;
  }>;
  expenses: Array<{
    id: number;
    tanggal: Date;
    tujuan: string;
    kategori: string;
    jumlah: number;
    keterangan: string | null;
  }>;
}

export interface RamadhanBukaPuasaReport {
  id: number;
  tanggal: Date;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  keterangan: string | null;
  status: string;
}