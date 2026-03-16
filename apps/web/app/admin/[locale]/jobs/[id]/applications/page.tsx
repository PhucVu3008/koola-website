'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/admin-api';
import { ArrowLeft, Mail, Phone, FileText, Linkedin, Globe, User } from 'lucide-react';
import { logger, LogContext } from '@/lib/logger';

interface Application {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone?: string;
  resume_filename?: string;
  resume_path?: string;
  cover_letter?: string;
  status: string;
  created_at: string;
}

interface Job {
  id: number;
  title: string;
}

/**
 * Job Applications Page
 *
 * View all applications for a specific job post
 */
export default function JobApplicationsPage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'vi') || 'en';
  const jobId = parseInt(params?.id as string);

  const [applications, setApplications] = useState<Application[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isNaN(jobId)) loadData();
  }, [jobId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [jobRes, appRes] = await Promise.all([
        adminApi.jobs.getById(jobId),
        adminApi.jobs.getApplications(jobId),
      ]);
      setJob(jobRes.data as Job);
      setApplications(Array.isArray(appRes.data) ? (appRes.data as Application[]) : []);
    } catch (error) {
      logger.error('Failed to load applications', error, LogContext.admin('list', 'applications'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      await adminApi.jobs.updateApplicationStatus(jobId, applicationId, newStatus);
      loadData();
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewing: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = ['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (isNaN(jobId)) {
    return <div className="text-center py-20 text-red-600">Invalid Job ID</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/admin/${locale}/jobs`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === 'vi' ? 'Ứng viên' : 'Applications'}
          </h1>
          {job && (
            <p className="text-gray-600 mt-1">{job.title}</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          {locale === 'vi' ? 'Đang tải...' : 'Loading...'}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          {locale === 'vi' ? 'Chưa có ứng viên nào' : 'No applications yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.full_name}</h3>
                    <p className="text-sm text-gray-500">{formatDate(app.created_at)}</p>
                  </div>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className={`px-3 py-1 text-sm font-medium rounded-full border-0 cursor-pointer ${getStatusColor(app.status)}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">{app.email}</a>
                </div>
                {app.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{app.phone}</span>
                  </div>
                )}
                {app.resume_filename && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{app.resume_filename}</span>
                  </div>
                )}
              </div>
              {app.cover_letter && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                  {app.cover_letter}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
