"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { tambahPemasukan, editPemasukan } from "@/app/pemasukan/actions";

const pemasukanSchema = z.object({
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  sumber: z.string().min(1, "Sumber harus diisi"),
  kategori: z.string().min(1, "Kategori harus dipilih"),
  jumlah: z.string().min(1, "Jumlah harus diisi"),
  keterangan: z.string().optional(),
});

type PemasukanFormData = z.infer<typeof pemasukanSchema>;

interface FormPemasukanProps {
  onSuccess?: () => void;
  editData?: {
    id: number;
    tanggal: Date;
    sumber: string;
    kategori: string;
    jumlah: number;
    keterangan: string | null;
  } | null;
  isEditMode?: boolean;
}

export function FormPemasukan({ onSuccess, editData, isEditMode = false }: FormPemasukanProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ramadanDay, setRamadanDay] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<PemasukanFormData>({
    resolver: zodResolver(pemasukanSchema),
    defaultValues: {
      tanggal: "",
      sumber: "",
      kategori: "",
      jumlah: "",
      keterangan: "",
    }
  });

  // Set form values when editing
  useEffect(() => {
    if (isEditMode && editData) {
      setValue("tanggal", new Date(editData.tanggal).toISOString().split('T')[0]);
      setValue("sumber", editData.sumber);
      setValue("kategori", editData.kategori);
      setValue("jumlah", editData.jumlah.toString());
      setValue("keterangan", editData.keterangan || "");
    }
  }, [isEditMode, editData, setValue]);

  const watchedDate = watch("tanggal");

  useEffect(() => {
    if (watchedDate) {
      const ramadanStart = new Date("2026-02-19");
      const ramadanEnd = new Date("2026-03-20");
      const selectedDate = new Date(watchedDate);

      if (selectedDate >= ramadanStart && selectedDate <= ramadanEnd) {
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

  const onSubmit = async (data: PemasukanFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("tanggal", data.tanggal);
      formData.append("sumber", data.sumber);
      formData.append("kategori", data.kategori);
      formData.append("jumlah", data.jumlah);
      formData.append("keterangan", data.keterangan || "");

      let result;
      if (isEditMode && editData) {
        result = await editPemasukan(editData.id, formData);
      } else {
        result = await tambahPemasukan(formData);
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            {...register("tanggal")}
            className="form-input"
          />
          {errors.tanggal && (
            <p className="mt-1 text-sm text-red-600">{errors.tanggal.message}</p>
          )}
          {ramadanDay && (
            <p className="mt-1 text-sm text-green-600 font-medium">
              Ramadhan Hari Ke-{ramadanDay} (1447 H)
            </p>
          )}
        </div>

        <div>
          <label className="form-label">Sumber</label>
          <input
            type="text"
            {...register("sumber")}
            placeholder="Contoh: Kotak Infaq Jumat"
            className="form-input"
          />
          {errors.sumber && (
            <p className="mt-1 text-sm text-red-600">{errors.sumber.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Kategori</label>
          <select {...register("kategori")} className="form-input">
            <option value="">Pilih Kategori</option>
            <option value="infaq">Infaq</option>
            <option value="sedekah">Sedekah</option>
            <option value="zakat">Zakat</option>
            <option value="donasi">Donasi</option>
            <option value="tarwih">Tarwih (Ramadhan)</option>
            <option value="lainnya">Lainnya</option>
          </select>
          {errors.kategori && (
            <p className="mt-1 text-sm text-red-600">{errors.kategori.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Jumlah</label>
          <input
            type="number"
            {...register("jumlah")}
            min="0"
            step="0.01"
            placeholder="0"
            className="form-input"
          />
          {errors.jumlah && (
            <p className="mt-1 text-sm text-red-600">{errors.jumlah.message}</p>
          )}
        </div>

        <div>
          <label className="form-label">Keterangan (Opsional)</label>
          <textarea
            {...register("keterangan")}
            rows={3}
            placeholder="Keterangan tambahan..."
            className="form-input"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : isEditMode ? "Update Pemasukan" : "Simpan Pemasukan"}
          </button>
        </div>
      </form>
    </div>
  );
}