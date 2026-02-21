"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahPengeluaran(formData: FormData) {
  try {
    const tanggal = new Date(formData.get("tanggal") as string);
    const tujuan = formData.get("tujuan") as string;
    const jumlah = parseFloat(formData.get("jumlah") as string);
    const kategori = formData.get("kategori") as string;
    const keterangan = formData.get("keterangan") as string;

    await prisma.pengeluaran.create({
      data: {
        tanggal,
        tujuan,
        jumlah,
        kategori,
        keterangan: keterangan || null,
      },
    });

    revalidatePath("/pengeluaran");
    revalidatePath("/dashboard");
    return { success: true, message: "Pengeluaran berhasil ditambahkan" };
  } catch (error) {
    console.error("Error adding pengeluaran:", error);
    return { success: false, message: "Gagal menambahkan pengeluaran" };
  }
}

export async function hapusPengeluaran(id: number) {
  try {
    await prisma.pengeluaran.delete({
      where: { id },
    });

    revalidatePath("/pengeluaran");
    revalidatePath("/dashboard");
    return { success: true, message: "Pengeluaran berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting pengeluaran:", error);
    return { success: false, message: "Gagal menghapus pengeluaran" };
  }
}

export async function getPengeluaran() {
  try {
    const data = await prisma.pengeluaran.findMany({
      orderBy: {
        tanggal: 'desc'
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching pengeluaran:", error);
    return [];
  }
}

export async function editPengeluaran(id: number, formData: FormData) {
  try {
    const tanggal = new Date(formData.get("tanggal") as string);
    const tujuan = formData.get("tujuan") as string;
    const jumlah = parseFloat(formData.get("jumlah") as string);
    const kategori = formData.get("kategori") as string;
    const keterangan = formData.get("keterangan") as string;

    await prisma.pengeluaran.update({
      where: { id },
      data: {
        tanggal,
        tujuan,
        jumlah,
        kategori,
        keterangan: keterangan || null,
      },
    });

    revalidatePath("/pengeluaran");
    revalidatePath("/dashboard");
    return { success: true, message: "Pengeluaran berhasil diupdate" };
  } catch (error) {
    console.error("Error editing pengeluaran:", error);
    return { success: false, message: "Gagal mengupdate pengeluaran" };
  }
}