interface TableProps {
  headers: string[];
  data: any[];
  emptyMessage?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function Table({ 
  headers, 
  data, 
  emptyMessage = "Tidak ada data",
  onEdit,
  onDelete 
}: TableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6 0a2 2 0 104 0 2 2 0 00-4 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm sm:text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {Object.values(row).map((cell: any, cellIndex) => (
                  <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof cell === 'number' && cell > 1000 
                      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cell)
                      : cell
                    }
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.id)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Hidden saat print */}
      <div className="md:hidden space-y-4 print:hidden">
        {data.map((row, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {headers.map((header, headerIndex) => {
              const cellValue = Object.values(row)[headerIndex];
              if (header === 'Aksi') return null; // Skip action column in mobile
              
              return (
                <div key={headerIndex} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm font-medium text-gray-600">{header}:</span>
                  <span className="text-sm text-gray-900 text-right">
                    <span className="text-green-600 font-medium">
                      {typeof cellValue === 'number' && cellValue > 1000
                        ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(cellValue)
                        : String(cellValue)
                      }
                    </span>
                  </span>
                </div>
              );
            })}
            
            {(onEdit || onDelete) && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                {onEdit && (
                  <button
                    onClick={() => onEdit(row.id)}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(row.id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Hapus
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
// Default export untuk kompatibilitas
export default Table;
