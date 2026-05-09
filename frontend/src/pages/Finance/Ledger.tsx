import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, FileText, ArrowRightLeft } from 'lucide-react';
import api from '../../services/api';

export const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get('/finance/journal-entries');
        setEntries(res.data.data);
      } catch (error) {
        console.error('Failed to fetch journal entries', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">General Ledger</h1>
          <p className="text-slate-600">Manage journal entries and account balances</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
            <Download size={18} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Assets</p>
              <h3 className="text-2xl font-bold text-slate-900">$530,000</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Liabilities</p>
              <h3 className="text-2xl font-bold text-slate-900">$60,000</h3>
            </div>
            <div className="p-2 rounded-lg bg-red-50">
              <ArrowRightLeft className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Equity</p>
              <h3 className="text-2xl font-bold text-slate-900">$370,000</h3>
            </div>
            <div className="p-2 rounded-lg bg-green-50">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Entries</h3>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600 text-sm">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Entry No.</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium text-right">Debit</th>
                <th className="pb-3 font-medium text-right">Credit</th>
                <th className="pb-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    Loading entries...
                  </td>
                </tr>
              ) : entries.length > 0 ? (
                entries.map((entry: any) => (
                  <tr key={entry._id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 text-sm text-slate-900">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="py-3 text-sm font-medium text-slate-900">{entry.entryNumber}</td>
                    <td className="py-3 text-sm text-slate-600">{entry.description}</td>
                    <td className="py-3 text-sm text-right font-medium text-slate-900">${entry.totalDebit.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right font-medium text-slate-900">${entry.totalCredit.toLocaleString()}</td>
                    <td className="py-3 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'posted' ? 'bg-green-100 text-green-700' : 
                        entry.status === 'draft' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No journal entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
