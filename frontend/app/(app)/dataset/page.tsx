'use client';

import { useState } from 'react';
import { Download, Loader2, Table } from 'lucide-react';
import { useDataset } from '@/lib/hooks';
import { downloadCSV } from '@/lib/utils';
import type { ExoplanetRecord } from '@/lib/types';

export default function DatasetPage() {
  const { data: dataset, isLoading, error } = useDataset({ page: 1, page_size: 100, sample: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 20;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4">
            <p className="text-red-400">Error loading dataset: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const records = dataset?.data || [];
  
  // Filter records
  const filteredRecords = records.filter((record: ExoplanetRecord) =>
    Object.values(record).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Paginate
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

  const handleDownload = () => {
    if (dataset?.data) {
      downloadCSV(dataset.data, 'fermix-exoplanet-dataset.csv');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center">
              <Table className="mr-3 h-10 w-10" />
              Dataset Explorer
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              {dataset?.total_records.toLocaleString()} NASA Kepler observations
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-white/60 text-sm font-medium rounded-md text-black bg-white hover:bg-white/90 transition-colors"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search dataset..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-black border border-white/20 rounded-md text-white placeholder-gray-500 focus:ring-2 focus:ring-white/40 focus:border-white/40"
          />
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    KOI Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Disposition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Period (days)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Radius (R⊕)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Temp (K)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Stellar Temp (K)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginatedRecords.map((record: ExoplanetRecord, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {record.kepoi_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.koi_disposition === 'CONFIRMED' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                          : record.koi_disposition === 'CANDIDATE'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/40'
                      }`}>
                        {record.koi_disposition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {typeof record.koi_period === 'number' ? record.koi_period.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {typeof record.koi_prad === 'number' ? record.koi_prad.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {typeof record.koi_teq === 'number' ? record.koi_teq.toFixed(0) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {typeof record.koi_steff === 'number' ? record.koi_steff.toFixed(0) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-t border-white/10 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-white/20 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
                  <span className="font-medium text-white">
                    {Math.min(startIndex + itemsPerPage, filteredRecords.length)}
                  </span> of{' '}
                  <span className="font-medium text-white">{filteredRecords.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white/20 bg-white/5 text-sm font-medium text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-white/20 bg-white/5 text-sm font-medium text-white">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white/20 bg-white/5 text-sm font-medium text-gray-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
