import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download, FileText, ArrowRightLeft } from 'lucide-react';
import api from '../../services/api';


export const Ledger = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatIndianShorthand = (val: number) => {
    if (val >= 10000000) return `INR ${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `INR ${(val / 100000).toFixed(2)} L`;
    if (val >= 1000) return `INR ${(val / 1000).toFixed(2)} K`;
    return `INR ${val}`;
  };

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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>General Ledger</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage journal entries and account balances</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary">
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="grid-12">
        <div className="card span-4 card-kpi">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Total Assets</p>
              <h2 style={{ fontSize: '1.75rem' }}>{formatIndianShorthand(530000)}</h2>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 12, background: 'rgba(230, 74, 25, 0.1)', color: 'var(--primary)' }}>
              <FileText size={24} />
            </div>
          </div>
        </div>
        <div className="card span-4 card-kpi">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Total Liabilities</p>
              <h2 style={{ fontSize: '1.75rem' }}>{formatIndianShorthand(60000)}</h2>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 12, background: 'rgba(220, 38, 38, 0.1)', color: 'var(--danger)' }}>
              <ArrowRightLeft size={24} />
            </div>
          </div>
        </div>
        <div className="card span-4 card-kpi">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="label-overline" style={{ marginBottom: '0.5rem' }}>Total Equity</p>
              <h2 style={{ fontSize: '1.75rem' }}>{formatIndianShorthand(370000)}</h2>
            </div>
            <div style={{ padding: '0.75rem', borderRadius: 12, background: 'rgba(22, 163, 74, 0.1)', color: 'var(--success)' }}>
              <FileText size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem' }}>Recent Entries</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flex: 1, justifyContent: 'flex-end', minWidth: 300 }}>
            <div className="search-field-wrap" style={{ flex: '0 1 320px' }}>
              <Search 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', zIndex: 1 }} 
                size={16} 
              />
              <input 
                type="text" 
                placeholder="Search entries..." 
                className="input"
                style={{ paddingLeft: '2.75rem' }}
              />
            </div>
            <button className="btn btn-secondary">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Entry No.</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Debit</th>
                <th style={{ textAlign: 'right' }}>Credit</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                    <div className="animate-spin" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--primary)', borderBottomColor: 'transparent', margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Loading entries...</p>
                  </td>
                </tr>
              ) : entries.length > 0 ? (
                entries.map((entry: any) => (
                  <tr key={entry._id}>
                    <td style={{ color: 'var(--text-primary)' }}>{new Date(entry.date).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.entryNumber}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{entry.description}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>INR {entry.totalDebit.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>INR {entry.totalCredit.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`label-overline`} style={{ 
                        fontSize: '0.65rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 20,
                        background: entry.status === 'posted' ? 'rgba(22, 163, 74, 0.1)' : entry.status === 'draft' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                        color: entry.status === 'posted' ? 'var(--success)' : entry.status === 'draft' ? 'var(--warning)' : 'var(--danger)',
                        border: '1px solid currentColor',
                        display: 'inline-block'
                      }}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
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
