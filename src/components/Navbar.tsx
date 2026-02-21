import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              🕌 Keuangan Masjid
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="hover:bg-green-500 px-3 py-2 rounded">
              Dashboard
            </Link>
            <Link href="/pemasukan" className="hover:bg-green-500 px-3 py-2 rounded">
              Pemasukan
            </Link>
            <Link href="/pengeluaran" className="hover:bg-green-500 px-3 py-2 rounded">
              Pengeluaran
            </Link>
            <Link href="/buka-puasa" className="hover:bg-green-500 px-3 py-2 rounded">
              Buka Puasa
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}