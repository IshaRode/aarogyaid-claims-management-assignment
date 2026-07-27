import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Sparkles, FileText,
  DollarSign, MessageSquare, CheckCircle, XCircle, Clock,
  ExternalLink, Eye,
} from 'lucide-react';
import { claimsService } from '../../services/claims.service';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDateTime, generateClaimId, isImageFile, isPdfFile, getDocUrl } from '../../utils/helpers';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3001';

function TimelineItem({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="flex gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="flex-1 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export function ClaimDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDocModal, setShowDocModal] = useState(false);

  const { data: claim, isLoading } = useQuery({
    queryKey: ['claim', id],
    queryFn: () => claimsService.getClaimById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Claim not found.</p>
      </div>
    );
  }

  const docUrl = getDocUrl(claim.uploadedDocument);

  const riskColors: Record<string, string> = {
    Low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-200',
    High: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/patient' },
            { label: 'Claim Details' },
          ]}
        />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {generateClaimId(claim._id)}
              </h1>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Submitted on {formatDateTime(claim.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Claim Summary */}
      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Claim Summary</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3.5 h-3.5" /> Claim Amount
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(claim.claimAmount)}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5" /> Approved Amount
            </p>
            <p className={`text-lg font-bold ${claim.approvedAmount ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : '—'}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-2">Description</p>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{claim.description}</p>
        </div>

        {claim.insurerComments && (
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
            <p className="text-xs text-blue-500 flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5" /> Insurer Comments
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200">{claim.insurerComments}</p>
          </div>
        )}
      </div>

      {/* Document */}
      {docUrl && (
        <div className="card p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Uploaded Document</h2>
          {isImageFile(claim.uploadedDocument!) ? (
            <div className="relative group cursor-pointer" onClick={() => setShowDocModal(true)}>
              <img
                src={docUrl}
                alt="Claim document"
                className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Eye className="w-4 h-4" /> View Full Size
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {claim.uploadedDocument?.split('/').pop()}
                </p>
                <p className="text-xs text-slate-400">PDF Document</p>
              </div>
              <a
                href={docUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Open <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      {claim.aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 space-y-3 bg-gradient-to-br from-violet-50/80 to-blue-50/80 dark:from-violet-950/30 dark:to-blue-950/30 border-violet-100 dark:border-violet-900/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                AI Assistant (Preview)
              </span>
            </div>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${riskColors[claim.riskLevel] || riskColors['Low']}`}>
              {claim.riskLevel} Risk
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{claim.aiSummary}</p>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Timeline</h2>
        <div className="space-y-3">
          <TimelineItem
            icon={<FileText className="w-4 h-4" />}
            title="Claim Submitted"
            desc={formatDateTime(claim.createdAt)}
            color="bg-blue-100 dark:bg-blue-900/40 text-blue-500"
          />
          <TimelineItem
            icon={<Clock className="w-4 h-4" />}
            title="Under Review"
            desc="Assigned to insurer review queue"
            color="bg-amber-100 dark:bg-amber-900/40 text-amber-500"
          />
          {claim.status === 'Approved' && (
            <TimelineItem
              icon={<CheckCircle className="w-4 h-4" />}
              title="Claim Approved"
              desc={`Approved amount: ${claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'N/A'}`}
              color="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500"
            />
          )}
          {claim.status === 'Rejected' && (
            <TimelineItem
              icon={<XCircle className="w-4 h-4" />}
              title="Claim Rejected"
              desc={claim.insurerComments || 'Claim did not meet approval criteria'}
              color="bg-red-100 dark:bg-red-900/40 text-red-500"
            />
          )}
        </div>
      </div>

      {/* Document preview modal */}
      <Modal isOpen={showDocModal} onClose={() => setShowDocModal(false)} title="Document Preview" size="xl">
        {docUrl ? (
          isPdfFile(claim.uploadedDocument) ? (
            <div className="space-y-4">
              <iframe
                src={docUrl}
                title="Document Preview"
                className="w-full h-[65vh] rounded-xl border border-slate-200 dark:border-slate-800"
              />
              <div className="flex justify-end">
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Open in new tab <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={docUrl}
                alt="Document preview"
                className="w-full max-h-[70vh] object-contain rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById(`doc-error-fallback-patient-${claim._id}`);
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id={`doc-error-fallback-patient-${claim._id}`}
                className="hidden flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3"
              >
                <FileText className="w-12 h-12 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">Document File</p>
                  <p className="text-xs text-slate-400 mt-1">{claim.uploadedDocument?.split('/').pop() || 'Attached File'}</p>
                </div>
                <a
                  href={docUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
                >
                  Open / Download Document <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-8 text-slate-500">No document attached.</div>
        )}
      </Modal>
    </div>
  );
}
