import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data contoh pemasukan
  await prisma.pemasukan.createMany({
    data: [
      {
        tanggal: new Date('2026-02-15'),
        sumber: 'Kotak Infaq Jumat',
        jumlah: 250000,
        kategori: 'infaq',
        keterangan: 'Infaq Jumat minggu pertama Februari',
      },
      {
        tanggal: new Date('2026-02-19'),
        sumber: "Jamaah Tarwih",
        jumlah: 150000,
        kategori: 'tarwih',
        keterangan: 'Pemasukan dari jamaah sholat tarwih hari pertama Ramadhan',
      },
      {
        tanggal: new Date('2026-02-20'),
        sumber: 'Hj. Siti Fatimah',
        jumlah: 1000000,
        kategori: 'donasi',
        keterangan: 'Donasi untuk renovasi mihrab',
      },
      {
        tanggal: new Date('2026-02-21'),
        sumber: 'Kotak Sedekah',
        jumlah: 75000,
        kategori: 'sedekah',
        keterangan: 'Sedekah harian dari jamaah',
      },
    ],
    skipDuplicates: true,
  });

  // Seed data contoh pengeluaran
  await prisma.pengeluaran.createMany({
    data: [
      {
        tanggal: new Date('2026-02-10'),
        tujuan: 'PLN Listrik Masjid',
        jumlah: 450000,
        kategori: 'operasional',
        keterangan: 'Tagihan listrik bulan Januari 2026',
      },
      {
        tanggal: new Date('2026-02-15'),
        tujuan: 'PDAM Air Bersih',
        jumlah: 125000,
        kategori: 'operasional',
        keterangan: 'Tagihan air bulan Januari 2026',
      },
      {
        tanggal: new Date('2026-02-20'),
        tujuan: 'Toko Kebersihan Makmur',
        jumlah: 75000,
        kategori: 'pemeliharaan',
        keterangan: 'Pembelian sabun, tissue, dan pembersih lantai',
      },
      {
        tanggal: new Date('2026-02-18'),
        tujuan: 'Honor Ustadz Ramadhan',
        jumlah: 200000,
        kategori: 'kegiatan',
        keterangan: 'Honor ustadz untuk ceramah persiapan Ramadhan',
      },
    ],
    skipDuplicates: true,
  });

  // Seed data contoh buka puasa (jadwal penyedia selama Ramadhan)
  await prisma.bukaPuasa.createMany({
    data: [
      {
        nama: 'Ahmad Hidayat',
        alamat: 'Rawamakmur',
        telepon: '081234567890',
        tanggal: new Date('2026-02-19'), // Hari ke-1 Ramadhan
        status: 'confirmed',
        keterangan: 'Akan menyediakan nasi box untuk 50 orang',
      },
      {
        nama: 'Fatimah Azzahra',
        alamat: 'Rawamakmur',
        telepon: '089876543210',
        tanggal: new Date('2026-02-20'), // Hari ke-2 Ramadhan
        status: 'confirmed',
        keterangan: 'Menyediakan takjil kurma dan air putih',
      },
      {
        nama: 'Muhammad Soleh',
        alamat: 'Luar Rawamakmur',
        telepon: '087654321098',
        tanggal: new Date('2026-02-21'), // Hari ke-3 Ramadhan
        status: 'pending',
        keterangan: 'Akan koordinasi lebih lanjut untuk menu buka puasa',
      },
      {
        nama: 'Khadijah Ummul Mukminin',
        alamat: 'Rawamakmur',
        telepon: '085678901234',
        tanggal: new Date('2026-02-22'), // Hari ke-4 Ramadhan
        status: 'confirmed',
        keterangan: 'Menyediakan bubur ayam dan es teh manis',
      },
      {
        nama: 'Abdul Rahman',
        alamat: 'Luar Rawamakmur',
        telepon: '082345678901',
        tanggal: new Date('2026-02-23'), // Hari ke-5 Ramadhan
        status: 'confirmed',
        keterangan: 'Catering nasi gudeg dan sayur asem',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed data berhasil ditambahkan!');
  console.log('- Data pemasukan: 4 records');
  console.log('- Data pengeluaran: 4 records');
  console.log('- Data jadwal buka puasa: 5 records');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error seeding data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });