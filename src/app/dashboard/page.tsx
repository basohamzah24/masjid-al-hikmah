"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { LayoutWithSidebar } from "@/components/LayoutWithSidebar";
import { TrendingUp, TrendingDown, Wallet, Calendar, User, RefreshCw } from "lucide-react";
import { getDashboardData } from "./actions";

type DashboardData = {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
  pemasukanTerbaru: Array<{
    id: number;
    tanggal: Date;
    sumber: string;
    jumlah: number;
  }>;
  bukaPuasaSchedule: Array<{
    id: number;
    tanggal: Date;
    nama: string;
  }>;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getRamadanDay(date: Date) {
  const ramadanStart = new Date('2026-02-19');
  const diffTime = new Date(date).getTime() - ramadanStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0,
    pemasukanTerbaru: [],
    bukaPuasaSchedule: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching dashboard data...");
      const data = await getDashboardData();
      console.log("Dashboard data received");
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboardData();
        if (isMounted) {
          setDashboardData(data);
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

  const {
    totalPemasukan,
    totalPengeluaran,
    saldo,
    pemasukanTerbaru,
    bukaPuasaSchedule,
  } = dashboardData;

  return (
    <LayoutWithSidebar>
      <div className="px-4 py-2 sm:p-6 lg:p-8">
        {/* Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-4 sm:mb-0">
            🕌 Dashboard Keuangan Masjid
          </h1>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="btn-secondary inline-flex items-center gap-2 px-3 py-2 text-sm self-start sm:self-auto"
            title="Refresh Data Dashboard"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{isLoading ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className={`bg-white rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all ${isLoading ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Pemasukan</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-2">
                  {formatCurrency(totalPemasukan)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-md transition-all ${isLoading ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Total Pengeluaran</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-700 mt-2">
                  {formatCurrency(totalPengeluaran)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all sm:col-span-2 lg:col-span-1 ${isLoading ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Saldo</p>
                <p className={`text-2xl sm:text-3xl font-bold mt-2 ${
                  saldo >= 0 ? 'text-blue-700' : 'text-red-700'
                }`}>
                  {formatCurrency(saldo)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Pemasukan Terbaru */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${isLoading ? 'opacity-50' : ''}`}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              💰 Pemasukan Terbaru
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300 animate-spin" />
                  <p>Loading data...</p>
                </div>
              ) : pemasukanTerbaru.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada data pemasukan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-100">
                        <th className="text-left text-xs font-medium text-green-700 uppercase tracking-wider py-2">
                          Tanggal
                        </th>
                        <th className="text-left text-xs font-medium text-green-700 uppercase tracking-wider py-2">
                          Sumber
                        </th>
                        <th className="text-right text-xs font-medium text-green-700 uppercase tracking-wider py-2">
                          Jumlah
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pemasukanTerbaru.map((item) => (
                        <tr key={item.id} className="hover:bg-green-50 transition-colors">
                          <td className="py-3 text-sm text-gray-900">
                            {formatDate(item.tanggal)}
                          </td>
                          <td className="py-3 text-sm text-gray-900 max-w-0 truncate">
                            {item.sumber}
                          </td>
                          <td className="py-3 text-sm font-semibold text-green-700 text-right">
                            {formatCurrency(item.jumlah)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Jadwal Buka Puasa Ramadhan */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all ${isLoading ? 'opacity-50' : ''}`}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              🌙 Jadwal Penyedia Buka Puasa Ramadhan
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300 animate-spin" />
                  <p>Loading jadwal...</p>
                </div>
              ) : bukaPuasaSchedule.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada jadwal buka puasa</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bukaPuasaSchedule.map((item) => {
                    const ramadanDay = getRamadanDay(item.tanggal);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                            Hari ke-{ramadanDay}
                          </div>
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <User className="w-4 h-4 text-gray-500" />
                          {item.nama}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </LayoutWithSidebar>
  );
}