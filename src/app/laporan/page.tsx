'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import Modal from '@/components/Modal';
import Table from '@/components/Table';
import { 
  getRamadhanFinancialReport, 
  getRamadhanBukaPuasaReport 
} from './actions';
import { 
  RamadhanFinancialReport,
  RamadhanBukaPuasaReport 
} from '@/types';

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Tanggal mulai Ramadhan 1447 H (19 Februari 2026)
  const ramadhanStart = new Date('2026-02-19');
  const ramadhanEnd = new Date('2026-03-20'); // 29 hari Ramadhan
  const currentDate = new Date();
  const isRamadhan = currentDate >= ramadhanStart && currentDate <= ramadhanEnd;

  const handleReportClick = async (reportType: string) => {
    setSelectedReport(reportType);
    setShowModal(true);
    setLoading(true);
    
    try {
      let data;
      switch (reportType) {
        case 'ramadhan-keuangan':
          data = await getRamadhanFinancialReport();
          break;
        case 'ramadhan-bukapuasa':
          data = await getRamadhanBukaPuasaReport();
          break;
        default:
          data = null;
      }
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRamadhanDay = (date: Date) => {
    const diffTime = date.getTime() - ramadhanStart.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getReportTitle = () => {
    switch (selectedReport) {
      case 'ramadhan-keuangan': return 'Laporan Keuangan Ramadhan 1447 H';
      case 'ramadhan-bukapuasa': return 'Laporan Penyedia Buka Puasa Ramadhan 1447 H';
      default: return 'Laporan Ramadhan';
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <LayoutWithSidebar>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Laporan Ramadhan 1447 H</h1>
        <p className="text-gray-600 mb-8">Sistem Pelaporan Keuangan Masjid - Periode Ramadhan</p>
        
        {!isRamadhan && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p className="font-bold">ℹ️ Informasi:</p>
            <p>Periode Ramadhan 1447 H: {formatDate(ramadhanStart)} - {formatDate(ramadhanEnd)}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            title="Laporan Keuangan Ramadhan" 
            description="Ringkasan lengkap pemasukan dan pengeluaran selama bulan suci Ramadhan"
            onClick={() => handleReportClick('ramadhan-keuangan')}
          >
            <div className="mt-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                📊 Lihat Laporan Keuangan
              </button>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>• Daftar pemasukan & pengeluaran</p>
              <p>• Total saldo periode Ramadhan</p>
              <p>• Analisis kategori transaksi</p>
            </div>
          </Card>
          
          <Card 
            title="Laporan Penyedia Buka Puasa" 
            description="Jadwal dan data lengkap penyedia buka puasa selama Ramadhan"
            onClick={() => handleReportClick('ramadhan-bukapuasa')}
          >
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                🍽️ Lihat Laporan Buka Puasa
              </button>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>• Jadwal harian penyedia</p>
              <p>• Data kontak lengkap</p>
              <p>• Keterangan menu & catatan</p>
            </div>
          </Card>
        </div>

        {/* Modal untuk menampilkan laporan */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={getReportTitle()}
          size="xl"
        >
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                <p className="text-gray-600">Memuat laporan...</p>
              </div>
            ) : (
              <div className="print:p-0 print:min-h-screen">
                <style jsx global>{`
                  @media print {
                    * {
                      -webkit-print-color-adjust: exact !important;
                      color-adjust: exact !important;
                    }
                    body { 
                      margin: 0; 
                      font-size: 12px;
                    }
                    .modal-content { 
                      max-width: none !important; 
                      margin: 0 !important;
                      padding: 15px !important;
                      box-shadow: none !important;
                      border-radius: 0 !important;
                    }
                    table {
                      border-collapse: collapse !important;
                      width: 100% !important;
                      page-break-inside: avoid;
                    }
                    th, td {
                      border: 1px solid black !important;
                      padding: 4px !important;
                      font-size: 11px !important;
                    }
                    th {
                      background-color: #f5f5f5 !important;
                      font-weight: bold !important;
                    }
                    .print\\:page-break-before {
                      page-break-before: always;
                    }
                    .print\\:break-inside-avoid {
                      break-inside: avoid;
                    }
                    .overflow-x-auto {
                      overflow: visible !important;
                    }
                    .hidden {
                      display: none !important;
                    }
                  }
                `}</style>
                {/* Header laporan */}
                <div className="mb-6 print:mb-4 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{getReportTitle()}</h2>
                  <p className="text-gray-600">Masjid Al-Ikhlas</p>
                  <p className="text-sm text-gray-500">Periode: {formatDate(ramadhanStart)} - {formatDate(ramadhanEnd)}</p>
                  <p className="text-sm text-gray-500">Dicetak pada: {formatDate(new Date())}</p>
                </div>

                {/* Laporan Keuangan Ramadhan */}
                {selectedReport === 'ramadhan-keuangan' && reportData && (
                  <div>
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:break-inside-avoid">
                      <div className="text-center p-4 bg-green-50 print:bg-gray-100 rounded-lg border print:border-black">
                        <p className="text-green-700 print:text-black font-semibold mb-1">💰 Total Pemasukan</p>
                        <p className="text-2xl font-bold text-green-800 print:text-black">{formatCurrency(reportData.summary.totalIncome)}</p>
                        <p className="text-sm text-gray-600 print:text-black">{reportData.summary.incomeCount} transaksi</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 print:bg-gray-100 rounded-lg border print:border-black">
                        <p className="text-red-700 print:text-black font-semibold mb-1">💸 Total Pengeluaran</p>
                        <p className="text-2xl font-bold text-red-800 print:text-black">{formatCurrency(reportData.summary.totalExpense)}</p>
                        <p className="text-sm text-gray-600 print:text-black">{reportData.summary.expenseCount} transaksi</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 print:bg-gray-100 rounded-lg border print:border-black">
                        <p className="text-blue-700 print:text-black font-semibold mb-1">🏦 Saldo Akhir</p>
                        <p className="text-2xl font-bold text-blue-800 print:text-black">{formatCurrency(reportData.summary.balance)}</p>
                        <p className="text-sm text-gray-600 print:text-black">Per {formatDate(new Date())}</p>
                      </div>
                    </div>

                    {/* Tabel Pemasukan */}
                    <div className="mb-8 print:break-inside-avoid">
                      <h3 className="text-lg font-semibold text-gray-800 print:text-black mb-3 print:mb-2">📈 Rincian Pemasukan</h3>
                      {reportData.income.length > 0 ? (
                        <div className="print:break-inside-avoid">
                          <table className="min-w-full border-collapse border border-gray-300 print:border-black">
                            <thead>
                              <tr className="bg-gray-50 print:bg-white">
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Tanggal</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Sumber</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Kategori</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Jumlah</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Keterangan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.income.map((item: any, index: number) => (
                                <tr key={index} className="print:bg-white">
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {formatDate(new Date(item.tanggal))}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {item.sumber}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {item.kategori}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs font-medium">
                                    {formatCurrency(item.jumlah)}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {item.keterangan || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 print:text-black text-center py-4 border border-gray-300 print:border-black bg-gray-50 print:bg-white">Tidak ada data pemasukan dalam periode Ramadhan</p>
                      )}
                    </div>

                    {/* Tabel Pengeluaran */}
                    <div className="mb-8 print:page-break-before print:break-inside-avoid">
                      <h3 className="text-lg font-semibold text-gray-800 print:text-black mb-3 print:mb-2">📉 Rincian Pengeluaran</h3>
                      {reportData.expenses.length > 0 ? (
                        <div className="print:break-inside-avoid">
                          <table className="min-w-full border-collapse border border-gray-300 print:border-black">
                            <thead>
                              <tr className="bg-gray-50 print:bg-white">
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Tanggal</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Tujuan</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Kategori</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Jumlah</th>
                                <th className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-left text-xs font-medium text-gray-900 print:text-black">Keterangan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportData.expenses.map((item: any, index: number) => (
                                <tr key={index} className="print:bg-white">
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {formatDate(new Date(item.tanggal))}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {item.tujuan}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {item.kategori}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs font-medium">
                                    {formatCurrency(item.jumlah)}
                                  </td>
                                  <td className="border border-gray-300 print:border-black px-4 py-2 print:px-2 print:py-1 text-sm text-gray-900 print:text-black print:text-xs">
                                    {item.keterangan || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 print:text-black text-center py-4 border border-gray-300 print:border-black bg-gray-50 print:bg-white">Tidak ada data pengeluaran dalam periode Ramadhan</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Laporan Penyedia Buka Puasa */}
                {selectedReport === 'ramadhan-bukapuasa' && reportData && (
                  <div className="print:break-inside-avoid">
                    <h3 className="text-lg font-semibold text-gray-800 print:text-black mb-4">🍽️ Jadwal Penyedia Buka Puasa Ramadhan 1447 H</h3>
                    {reportData.length > 0 ? (
                      <div className="overflow-x-auto print:overflow-visible">
                        <table className="min-w-full divide-y divide-gray-200 print:border-collapse print:border print:border-black">
                          <thead className="bg-gray-50 print:bg-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 print:text-black print:border print:border-black uppercase tracking-wider print:px-2 print:py-1">Hari Ke</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 print:text-black print:border print:border-black uppercase tracking-wider print:px-2 print:py-1">Tanggal</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 print:text-black print:border print:border-black uppercase tracking-wider print:px-2 print:py-1">Nama Penyedia</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 print:text-black print:border print:border-black uppercase tracking-wider print:px-2 print:py-1">Alamat</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 print:text-black print:border print:border-black uppercase tracking-wider print:px-2 print:py-1">No. HP</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 print:text-black print:border print:border-black uppercase tracking-wider print:px-2 print:py-1">Keterangan</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-gray-50 print:bg-white">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 print:text-black print:border print:border-black print:px-2 print:py-1 print:text-xs">
                                  {getRamadhanDay(new Date(item.tanggal))}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:text-black print:border print:border-black print:px-2 print:py-1 print:text-xs">
                                  {formatDate(new Date(item.tanggal))}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:text-black print:border print:border-black print:px-2 print:py-1 print:text-xs">
                                  {item.nama}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 print:text-black print:border print:border-black print:px-2 print:py-1 print:text-xs">
                                  {item.alamat}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 print:text-black print:border print:border-black print:px-2 print:py-1 print:text-xs">
                                  {item.telepon}
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-900 print:text-black print:border print:border-black print:px-2 print:py-1 print:text-xs">
                                  {item.keterangan || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 print:text-black text-center py-8">Belum ada data penyedia buka puasa yang terdaftar</p>
                    )}
                  </div>
                )}

                {/* Tombol cetak */}
                <div className="mt-6 flex justify-end gap-3 print:hidden">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                  >
                    Tutup
                  </button>
                  <button 
                    onClick={printReport}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    🖨️ Cetak / Export PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </LayoutWithSidebar>
  );
}