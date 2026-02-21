"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { tambahDonaturBukaPuasa, editDonaturBukaPuasa } from "@/app/buka-puasa/actions";

// Schema validasi dengan Zod
const bukaPuasaSchema = z.object({
  namaPenyedia: z.string().min(1, "Nama penyedia harus diisi"),
  alamat: z.enum(["Rawamakmur", "Luar Rawamakmur", ""]).optional(),
  telepon: z.string().optional(),
  tanggal: z.string().min(1, "Tanggal buka puasa harus diisi"),
  keterangan: z.string().optional(),
});

type BukaPuasaFormData = z.infer<typeof bukaPuasaSchema>;

interface FormBukaPuasaProps {
  onSuccess?: () => void;
  editData?: {
    id: number;
    tanggal: Date;
    nama: string;
    alamat: string | null;
    telepon: string | null;
    keterangan: string | null;
  } | null;
  isEditMode?: boolean;
}

export function FormBukaPuasa({ onSuccess, editData, isEditMode = false }: FormBukaPuasaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ramadanDay, setRamadanDay] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BukaPuasaFormData>({
    resolver: zodResolver(bukaPuasaSchema),
    defaultValues: {
      namaPenyedia: "",
      alamat: "",
      telepon: "",
      tanggal: "",
      keterangan: "",
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (isEditMode && editData) {
      setValue("namaPenyedia", editData.nama);
      setValue("alamat", editData.alamat === "Rawamakmur" || editData.alamat === "Luar Rawamakmur" ? editData.alamat : "");
      setValue("telepon", editData.telepon || "");
      setValue("tanggal", new Date(editData.tanggal).toISOString().split('T')[0]);
      setValue("keterangan", editData.keterangan || "");
    }
  }, [isEditMode, editData, setValue]);

  // Watch tanggal field untuk kalkulasi hari Ramadan
  const watchedDate = watch("tanggal");

  // Kalkulasi hari Ramadan
  useEffect(() => {
    if (watchedDate) {
      const selectedDate = new Date(watchedDate);
      const ramadanStart = new Date("2026-02-19"); // 19 Februari 2026
      
      if (selectedDate >= ramadanStart) {
        const diffTime = selectedDate.getTime() - ramadanStart.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setRamadanDay(diffDays);
      } else {
        setRamadanDay(null);
      }
    } else {
      setRamadanDay(null);
    }
  }, [watchedDate]);

  const onSubmit = async (data: BukaPuasaFormData) => {
    setIsSubmitting(true);
    try {
      // Convert data ke FormData untuk server action
      const formData = new FormData();
      formData.append("nama", data.namaPenyedia);
      formData.append("alamat", data.alamat || "");
      formData.append("telepon", data.telepon || "");
      formData.append("tanggal", data.tanggal);
      formData.append("keterangan", data.keterangan || "");

      let result;
      if (isEditMode && editData) {
        result = await editDonaturBukaPuasa(editData.id, formData);
      } else {
        result = await tambahDonaturBukaPuasa(formData);
      }
      
      if (result.success) {
        if (!isEditMode) {
          reset();
          setRamadanDay(null);
        }
        alert(result.message);
        onSuccess?.();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama Penyedia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Penyedia <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("namaPenyedia")}
            placeholder="Nama lengkap penyedia"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
              errors.namaPenyedia ? "border-red-500" : ""
            }`}
          />
          {errors.namaPenyedia && (
            <p className="text-red-500 text-sm mt-1">{errors.namaPenyedia.message}</p>
          )}
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat
          </label>
          <select
            {...register("alamat")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors bg-white"
          >
            <option value="">Pilih alamat...</option>
            <option value="Rawamakmur">Rawamakmur</option>
            <option value="Luar Rawamakmur">Luar Rawamakmur</option>
          </select>
        </div>

        {/* Nomor Telepon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No. Telepon
          </label>
          <input
            type="tel"
            {...register("telepon")}
            placeholder="08xxxxxxxxxx"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Tanggal Buka Puasa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Buka Puasa <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("tanggal")}
            min="2026-02-19"
            max="2026-03-20"
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
              errors.tanggal ? "border-red-500" : ""
            }`}
          />
          {errors.tanggal && (
            <p className="text-red-500 text-sm mt-1">{errors.tanggal.message}</p>
          )}
          
          {/* Tampilkan Hari ke-X Ramadan */}
          {ramadanDay && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 text-sm font-medium">
                📅 Hari ke-{ramadanDay} Ramadhan 1447 H
              </p>
            </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        {/* Tombol Simpan */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium transition-all duration-200 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
              isEditMode ? "Update Penyedia" : "Simpan Penyedia"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}