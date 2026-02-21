"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahDonaturBukaPuasa(formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const alamat = formData.get("alamat") as string;
    const telepon = formData.get("telepon") as string;
    const tanggal = new Date(formData.get("tanggal") as string);
    const keterangan = formData.get("keterangan") as string;

    const result = await prisma.bukaPuasa.create({
      data: {
        nama,
        alamat: alamat || null,
        telepon: telepon || null,
        tanggal,
        status: "pending",
        keterangan: keterangan || null,
      },
    });

    // Revalidate multiple paths untuk memastikan cache ter-refresh
    revalidatePath("/buka-puasa");
    revalidatePath("/dashboard");
    
    console.log("Successfully added donatur:", result.id);
    return { success: true, message: "Penyedia buka puasa berhasil ditambahkan" };
  } catch (error) {
    console.error("Error adding buka puasa:", error);
    return { success: false, message: "Gagal menambahkan penyedia buka puasa" };
  }
}

export async function updateStatusBukaPuasa(id: number, status: string) {
  try {
    await prisma.bukaPuasa.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/buka-puasa");
    revalidatePath("/dashboard");
    return { success: true, message: "Status berhasil diupdate" };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, message: "Gagal mengupdate status" };
  }
}

export async function hapusDonaturBukaPuasa(id: number) {
  try {
    await prisma.bukaPuasa.delete({
      where: { id },
    });

    revalidatePath("/buka-puasa");
    revalidatePath("/dashboard");
    return { success: true, message: "Donatur berhasil dihapus" };
  } catch (error) {
    console.error("Error deleting donatur:", error);
    return { success: false, message: "Gagal menghapus donatur" };
  }
}

export async function getDonaturBukaPuasa() {
  try {
    console.log("Fetching donatur buka puasa data...");
    const data = await prisma.bukaPuasa.findMany({
      orderBy: {
        tanggal: 'asc'
      }
    });
    console.log(`Found ${data.length} donatur records`);
    return data;
  } catch (error) {
    console.error("Error fetching donatur:", error);
    return [];
  }
}

export async function editDonaturBukaPuasa(id: number, formData: FormData) {
  try {
    const nama = formData.get("nama") as string;
    const alamat = formData.get("alamat") as string;
    const telepon = formData.get("telepon") as string;
    const tanggal = new Date(formData.get("tanggal") as string);
    const keterangan = formData.get("keterangan") as string;

    await prisma.bukaPuasa.update({
      where: { id },
      data: {
        nama,
        alamat: alamat || null,
        telepon: telepon || null,
        tanggal,
        keterangan: keterangan || null,
      },
    });

    revalidatePath("/buka-puasa");
    revalidatePath("/dashboard");
    return { success: true, message: "Penyedia buka puasa berhasil diupdate" };
  } catch (error) {
    console.error("Error editing donatur:", error);
    return { success: false, message: "Gagal mengupdate penyedia buka puasa" };
  }
}