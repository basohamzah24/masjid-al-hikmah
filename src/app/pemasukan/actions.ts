"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahPemasukan(formData: FormData) {
  try {
    const tanggal = new Date(formData.get("tanggal") as string);
    const sumber = formData.get("sumber") as string;
    const jumlah = parseFloat(formData.get("jumlah") as string);
    const kategori = formData.get("kategori") as string;
    const keterangan = formData.get("keterangan") as string;

    await prisma.pemasukan.create({
      data: {
        tanggal,
        sumber,
        jumlah,
        kategori,
        keterangan: keterangan || null,
      },
    });

    revalidatePath("/pemasukan");
    revalidatePath("/dashboard");
    return { success: true, message: "Pemasukan berhasil ditambahkan" };
  } catch (error) {
    console.error("Error adding pemasukan:", error);
    return { success: false, message: "Gagal menambahkan pemasukan" };
  }
}

export async function hapusPemasukan(id: number) {
  try {
    await prisma.pemasukan.delete({
      where: { id },
    });

    revalidatePath("/pemasukan");
    revalidatePath("/dashboard");
    return { success: true, message: "Pemasukan berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting pemasukan:", error);
    return { success: false, message: "Gagal menghapus pemasukan" };
  }
}

export async function getPemasukan() {
  try {
    const data = await prisma.pemasukan.findMany({
      orderBy: {
        tanggal: 'desc'
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching pemasukan:", error);
    return [];
  }
}

export async function editPemasukan(id: number, formData: FormData) {
  try {
    const tanggal = new Date(formData.get("tanggal") as string);
    const sumber = formData.get("sumber") as string;
    const jumlah = parseFloat(formData.get("jumlah") as string);
    const kategori = formData.get("kategori") as string;
    const keterangan = formData.get("keterangan") as string;

    await prisma.pemasukan.update({
      where: { id },
      data: {
        tanggal,
        sumber,
        jumlah,
        kategori,
        keterangan: keterangan || null,
      },
    });

    revalidatePath("/pemasukan");
    revalidatePath("/dashboard");
    return { success: true, message: "Pemasukan berhasil diupdate" };
  } catch (error) {
    console.error("Error editing pemasukan:", error);
    return { success: false, message: "Gagal mengupdate pemasukan" };
  }
}