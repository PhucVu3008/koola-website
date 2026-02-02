'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';

/**
 * Leads Management Page
 * 
 * View and manage contact form submissions
 */
export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, qualified: 0, closed: 0 });

  useEffect(() => {
    loadLeads();
  }, [status, page]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params: any = { page, pageSize: 20 };
      if (status) params.status = status;

      const response = await adminApi.listLeads(params);
      setLeads(Array.isArray(response.data) ? response.data : []);
      setTotalPages(response.meta?.totalPages || 1);
      
      // Calculate stats from all leads
      const allLeads = Array.isArray(response.data) ? response.data : [];
      const newStats = {
        total: response.meta?.total || 0,
        new: allLeads.filter((l: any) => l.status === 'new').length,
        contacted: allLeads.filter((l: any) => l.status === 'contacted').length,
        qualified: allLeads.filter((l: any) => l.status === 'qualified').length,
        closed: allLeads.filter((l: any) => l.status === 'closed').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error('Failed to load leads:', error);
      alert('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await adminApi.updateLeadStatus(id, newStatus);
      alert('Status updated successfully');
      loadLeads();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="mt-1 text-gray-600">Contact form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Leads</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
          <div className="text-sm text-blue-600">🆕 New</div>
          <div className="text-2xl font-bold text-blue-900">{stats.new}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-sm text-yellow-600">📞 Contacted</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.contacted}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-sm text-green-600">✅ Qualified</div>
          <div className="text-2xl font-bold text-green-900">{stats.qualified}</div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4 border border-gray-200">
          <div className="text-sm text-gray-600">🔒 Closed</div>
          <div className="text-2xl font-bold text-gray-900">{stats.closed}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading leads...</div>
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-5xl mb-4">📨</div>
          <p className="text-gray-600">No leads found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name / Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email / Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{lead.full_name}</div>
                      {lead.company && (
                        <div className="text-sm text-gray-600">{lead.company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <div className="text-sm text-gray-600">
                          <a href={`tel:${lead.phone}`} className="hover:text-blue-600">
                            {lead.phone}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {lead.message ? (
                          <div className="truncate" title={lead.message}>
                            {lead.message}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      {lead.source_path && (
                        <div className="text-xs text-gray-500 mt-1">
                          Source: {lead.source_path}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          lead.status === 'new'
                            ? 'border-blue-300 bg-blue-50 text-blue-700'
                            : lead.status === 'contacted'
                            ? 'border-yellow-300 bg-yellow-50 text-yellow-700'
                            : lead.status === 'qualified'
                            ? 'border-green-300 bg-green-50 text-green-700'
                            : 'border-gray-300 bg-gray-50 text-gray-700'
                        }`}
                      >
                        <option value="new">🆕 New</option>
                        <option value="contacted">📞 Contacted</option>
                        <option value="qualified">✅ Qualified</option>
                        <option value="closed">🔒 Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div>{new Date(lead.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(lead.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
