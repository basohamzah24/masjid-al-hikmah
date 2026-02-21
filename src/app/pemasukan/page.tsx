"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, DollarSign, Tag, MessageSquare, Coins } from "lucide-react";
import { FormPemasukan } from "@/components/forms/FormPemasukan";
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import { Modal } from "@/components/Modal";
import { getPemasukan, hapusPemasukan } from "./actions";

type PemasukanData = {
  id: number;
  tanggal: Date;
  sumber: string;
  kategori: string;
  jumlah: number;
  keterangan: string | null;
  createdAt: Date;
};

export default function PemasukanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<PemasukanData | null>(null);
  const [pemasukanData, setPemasukanData] = useState<PemasukanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getPemasukan();
    setPemasukanData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getPemasukan();
        if (isMounted) {
          setPemasukanData(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSuccess = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditData(null);
    fetchData();
  };

  const handleEdit = (data: PemasukanData) => {
    setEditData(data);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const result = await hapusPemasukan(id);
      if (result.success) {
        alert(result.message);
        fetchData();
      } else {
        alert(result.message);
      }
    }
  };

  const getRamadanDay = (date: Date) => {
    const ramadanStart = new Date("2026-02-19");
    const ramadanEnd = new Date("2026-03-20");
    const selectedDate = new Date(date);

    if (selectedDate >= ramadanStart && selectedDate <= ramadanEnd) {
      const diffTime = selectedDate.getTime() - ramadanStart.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (kategori: string) => {
    switch (kategori) {
      case "infaq":
        return "🤲";
      case "sedekah":
        return "💝";
      case "zakat":
        return "🌙";
      case "donasi":
        return "💖";
      case "tarwih":
        return "🕌";
      default:
        return "💰";
    }
  };

  const getTotalPemasukan = () => {
    return pemasukanData.reduce((total, item) => total + item.jumlah, 0);
  };

  return (
    <LayoutWithSidebar>
      <div className="px-4 py-2 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              💰 Kelola Pemasukan Masjid
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Catat dan kelola semua pemasukan masjid dengan mudah
            </p>
            {pemasukanData.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Total Pemasukan: {formatCurrency(getTotalPemasukan())}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setIsEditMode(false);
              setEditData(null);
              setIsModalOpen(true);
            }}
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm sm:text-base mt-4 sm:mt-0"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Tambah Pemasukan</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              📊 Data Pemasukan Masjid
            </h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : pemasukanData.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  💰
                </div>
                <p className="text-gray-600 text-lg mb-2">Belum ada data pemasukan</p>
                <p className="text-gray-500">Mulai catat pemasukan masjid Anda</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Sumber
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Keterangan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pemasukanData.map((item) => {
                      const ramadanDay = getRamadanDay(new Date(item.tanggal));
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(new Date(item.tanggal))}
                            </div>
                            {ramadanDay && (
                              <div className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Ramadhan Hari ke-{ramadanDay} (1447 H)
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-900">
                              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                              {item.sumber}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {getCategoryIcon(item.kategori)}
                              {item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold text-green-700">
                              {formatCurrency(item.jumlah)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {item.keterangan || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditData(null);
          }}
          title={isEditMode ? "Edit Pemasukan" : "Tambah Pemasukan"}
          size="lg"
        >
          <FormPemasukan 
            onSuccess={handleSuccess} 
            editData={editData}
            isEditMode={isEditMode}
          />
        </Modal>
      </div>
    </LayoutWithSidebar>
  );
}