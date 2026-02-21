"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  try {
    console.log("Fetching dashboard data...");
    
    // Get all pemasukan data
    const pemasukan = await prisma.pemasukan.findMany();
    const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.jumlah, 0);

    // Get all pengeluaran data
    const pengeluaran = await prisma.pengeluaran.findMany();
    const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);

    // Calculate saldo
    const saldo = totalPemasukan - totalPengeluaran;

    // Get 5 latest pemasukan
    const pemasukanTerbaru = await prisma.pemasukan.findMany({
      orderBy: { tanggal: 'desc' },
      take: 5,
    });

    // Get buka puasa schedule
    const bukaPuasaSchedule = await prisma.bukaPuasa.findMany({
      orderBy: { tanggal: 'asc' }
    });

    console.log(`Dashboard data fetched: ${pemasukan.length} pemasukan, ${pengeluaran.length} pengeluaran, ${bukaPuasaSchedule.length} buka puasa`);

    return {
      totalPemasukan,
      totalPengeluaran,
      saldo,
      pemasukanTerbaru,
      bukaPuasaSchedule,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      totalPemasukan: 0,
      totalPengeluaran: 0,
      saldo: 0,
      pemasukanTerbaru: [],
      bukaPuasaSchedule: [],
    };
  }
}