import { prisma } from './prisma';

// Database connection and utility functions
export const db = prisma;

// Helper functions untuk operasi database umum
export async function checkDatabaseConnection() {
  try {
    await db.$connect();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export async function disconnectDatabase() {
  await db.$disconnect();
}

// Fungsi helper untuk mendapatkan ringkasan keuangan
export async function getRingkasanKeuangan() {
  try {
    const totalPemasukan = await db.pemasukan.aggregate({
      _sum: {
        jumlah: true,
      },
    });

    const totalPengeluaran = await db.pengeluaran.aggregate({
      _sum: {
        jumlah: true,
      },
    });

    const totalBukaPuasa = await db.bukaPuasa.aggregate({
      _count: {
        id: true,
      },
    });

    const saldo = (totalPemasukan._sum.jumlah || 0) - 
                  (totalPengeluaran._sum.jumlah || 0);

    return {
      totalPemasukan: totalPemasukan._sum.jumlah || 0,
      totalPengeluaran: totalPengeluaran._sum.jumlah || 0,
      totalBukaPuasa: totalBukaPuasa._count.id || 0,
      saldo,
    };
  } catch (error) {
    console.error('Error getting ringkasan keuangan:', error);
    return {
      totalPemasukan: 0,
      totalPengeluaran: 0,
      totalBukaPuasa: 0,
      saldo: 0,
    };
  }
}