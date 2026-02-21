"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { tambahPengeluaran, editPengeluaran } from "@/app/pengeluaran/actions";

const pengeluaranSchema = z.object({
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  tujuan: z.string().min(1, "Tujuan harus diisi"),
  kategori: z.string().min(1, "Kategori harus dipilih"),
  jumlah: z.string().min(1, "Jumlah harus diisi"),
  keterangan: z.string().optional(),
});

type PengeluaranFormData = z.infer<typeof pengeluaranSchema>;

interface FormPengeluaranProps {
  onSuccess?: () => void;
  editData?: {
    id: number;
    tanggal: Date;
    tujuan: string;
    kategori: string;
    jumlah: number;
    keterangan: string | null;
  } | null;
  isEditMode?: boolean;
}

export function FormPengeluaran({ onSuccess, editData, isEditMode = false }: FormPengeluaranProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<PengeluaranFormData>({
    resolver: zodResolver(pengeluaranSchema),
    defaultValues: {
      tanggal: "",
      tujuan: "",
      kategori: "",
      jumlah: "",
      keterangan: "",
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (isEditMode && editData) {
      setValue("tanggal", new Date(editData.tanggal).toISOString().split('T')[0]);
      setValue("tujuan", editData.tujuan);
      setValue("kategori", editData.kategori);
      setValue("jumlah", editData.jumlah.toString());
      setValue("keterangan", editData.keterangan || "");
    }
  }, [isEditMode, editData, setValue]);

  const onSubmit = async (data: PengeluaranFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("tanggal", data.tanggal);
      formData.append("tujuan", data.tujuan);
      formData.append("kategori", data.kategori);
      formData.append("jumlah", data.jumlah);
      formData.append("keterangan", data.keterangan || "");

      let result;
      if (isEditMode && editData) {
        result = await editPengeluaran(editData.id, formData);
      } else {
        result = await tambahPengeluaran(formData);
      }
      
      if (result.success) {
        if (!isEditMode) {
          reset();
        }
        alert(result.message);
        onSuccess?.();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tanggal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("tanggal")}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
              errors.tanggal ? "border-red-500" : ""
            }`}
          />
          {errors.tanggal && (
            <p className="text-red-500 text-sm mt-1">{errors.tanggal.message}</p>
          )}
        </div>

        {/* Tujuan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tujuan Pengeluaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("tujuan")}
            placeholder="Contoh: Listrik Masjid"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
              errors.tujuan ? "border-red-500" : ""
            }`}
          />
          {errors.tujuan && (
            <p className="text-red-500 text-sm mt-1">{errors.tujuan.message}</p>
          )}
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            {...register("kategori")}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors bg-white ${
              errors.kategori ? "border-red-500" : ""
            }`}
          >
            <option value="">Pilih Kategori</option>
            <option value="operasional">🔧 Operasional</option>
            <option value="pemeliharaan">🔨 Pemeliharaan</option>
            <option value="kegiatan">🎉 Kegiatan</option>
            <option value="konsumsi">🍽️ Konsumsi</option>
            <option value="sosial">🤝 Sosial</option>
            <option value="lainnya">📄 Lainnya</option>
          </select>
          {errors.kategori && (
            <p className="text-red-500 text-sm mt-1">{errors.kategori.message}</p>
          )}
        </div>

        {/* Jumlah */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("jumlah")}
            min="0"
            step="0.01"
            placeholder="0"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
              errors.jumlah ? "border-red-500" : ""
            }`}
          />
          {errors.jumlah && (
            <p className="text-red-500 text-sm mt-1">{errors.jumlah.message}</p>
          )}
        </div>

        {/* Keterangan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keterangan
          </label>
          <textarea
            {...register("keterangan")}
            rows={3}
            placeholder="Keterangan tambahan..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menyimpan...
              </span>
            ) : (
              isEditMode ? "Update Pengeluaran" : "Simpan Pengeluaran"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}