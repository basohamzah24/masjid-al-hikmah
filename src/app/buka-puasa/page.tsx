"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, MapPin, Phone, MessageSquare } from "lucide-react";
import { FormBukaPuasa } from "@/components/forms/FormBukaPuasa";
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import { Modal } from "@/components/Modal";
import { getDonaturBukaPuasa, hapusDonaturBukaPuasa } from "./actions";

type BukaPuasaData = {
  id: number;
  tanggal: Date;
  nama: string;
  alamat: string | null;
  telepon: string | null;
  keterangan: string | null;
  status: string;
  createdAt: Date;
};

export default function BukaPuasaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<BukaPuasaData | null>(null);
  const [bukaPuasaData, setBukaPuasaData] = useState<BukaPuasaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getDonaturBukaPuasa();
    setBukaPuasaData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getDonaturBukaPuasa();
        if (isMounted) {
          setBukaPuasaData(data);
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

  const handleEdit = (data: BukaPuasaData) => {
    setEditData(data);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      const result = await hapusDonaturBukaPuasa(id);
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
    const diffTime = date.getTime() - ramadanStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <LayoutWithSidebar>
      <div className="px-4 py-2 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🌙 Sistem Penjadwalan Buka Puasa Ramadhan
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Ramadhan 1447 H • Kelola jadwal buka puasa dengan mudah dan terorganisir
            </p>
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
            <span className="hidden sm:inline">Tambah Penyedia</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              📅 Jadwal Penyedia Buka Puasa
            </h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-2 text-gray-600">Memuat data...</p>
              </div>
            ) : bukaPuasaData.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  🍽️
                </div>
                <p className="text-gray-600 text-lg mb-2">Belum ada penyedia buka puasa</p>
                <p className="text-gray-500">Mulai tambahkan penyedia untuk jadwal buka puasa Ramadhan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Hari Ramadhan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Nama Penyedia
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        Alamat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">
                        No HP
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
                    {bukaPuasaData.map((item) => {
                      const ramadanDay = getRamadanDay(new Date(item.tanggal));
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 text-green-600 mr-2" />
                              <span className="font-medium text-green-700">
                                Hari ke-{ramadanDay}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">
                              {formatDate(new Date(item.tanggal))}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{item.nama}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {item.alamat || "-"}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 mr-1" />
                              {item.telepon || "-"}
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
          title={isEditMode ? "Edit Penyedia Buka Puasa" : "Tambah Penyedia Buka Puasa"}
          size="lg"
        >
          <FormBukaPuasa 
            onSuccess={handleSuccess} 
            editData={editData}
            isEditMode={isEditMode}
          />
        </Modal>
      </div>
    </LayoutWithSidebar>
  );
}