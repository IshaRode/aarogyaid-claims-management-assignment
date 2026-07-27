import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, XCircle, FileText, User, Calendar, DollarSign,
  MessageSquare, Sparkles, Eye, ExternalLink, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { claimsService } from '../../services/claims.service';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { Skeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatDateTime, generateClaimId, isImageFile, isPdfFile, getDocUrl } from '../../utils/helpers';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const reviewSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  approvedAmount: z.number().min(0).optional(),
  insurerComments: z.string().optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;

export function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [pendingData, setPendingData] = useState<ReviewForm | null>(null);

  const { data: claim, isLoading } = useQuery({
    queryKey: ['claim', id],
    queryFn: () => claimsService.getClaimById(id!),
    enabled: !!id,
  });

  const { register, handleSubmit, control, watch } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: 'Approved',
      approvedAmount: undefined,
      insurerComments: '',
    },
  });

  const selectedStatus = watch('status');

  const updateMutation = useMutation({
    mutationFn: (data: ReviewForm) => claimsService.updateClaim(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
      queryClient.invalidateQueries({ queryKey: ['all-claims'] });
      queryClient.invalidateQueries({ queryKey: ['insurer-stats'] });
      toast.success(`Claim ${pendingData?.status === 'Approved' ? 'approved' : 'rejected'} successfully!`);
      navigate('/insurer/claims');
    },
    onError: () => {
      toast.error('Failed to update claim. Please try again.');
    },
  });

  const onSubmit = (data: ReviewForm) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingData) {
      updateMutation.mutate(pendingData);
    }
    setShowConfirm(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!claim) return <div className="text-center py-20"><p>Claim not found.</p></div>;

  const docUrl = getDocUrl(claim.uploadedDocument);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/insurer' },
            { label: 'Claims', href: '/insurer/claims' },
            { label: 'Review' },
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
                Review {generateClaimId(claim._id)}
              </h1>
              <StatusBadge status={claim.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Submitted {formatDateTime(claim.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Claim Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Details */}
          <div className="card p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-2">
              <User className="w-4 h-4" /> Patient Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Name</p>
                <p className="font-medium text-slate-900 dark:text-white">{claim.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Email</p>
                <p className="font-medium text-slate-900 dark:text-white">{claim.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Claim Amount</p>
                <p className="font-bold text-slate-900 dark:text-white text-base">{formatCurrency(claim.claimAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" /> Submitted</p>
                <p className="font-medium text-slate-900 dark:text-white">{formatDateTime(claim.createdAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
                {claim.description}
              </p>
            </div>
          </div>

          {/* Document */}
          {docUrl && (
            <div className="card p-6 space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-2">
                <FileText className="w-4 h-4" /> Receipt / Prescription
              </h2>
              {isImageFile(claim.uploadedDocument!) ? (
                <div className="relative group cursor-pointer" onClick={() => setShowDocModal(true)}>
                  <img
                    src={docUrl}
                    alt="Document"
                    className="w-full h-56 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-6 bg-gradient-to-br from-violet-50/80 to-blue-50/80 dark:from-violet-950/30 dark:to-blue-950/30 border-violet-100 dark:border-violet-900/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                    AI Assistant (Preview)
                  </span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border
                  ${claim.riskLevel === 'Low'
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                    : claim.riskLevel === 'Medium'
                    ? 'text-amber-600 bg-amber-50 border-amber-200'
                    : 'text-red-600 bg-red-50 border-red-200'
                  }`}
                >
                  {claim.riskLevel} Risk
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{claim.aiSummary}</p>
            </motion.div>
          )}
        </div>

        {/* Right: Review Form */}
        <div className="space-y-4">
          {claim.status !== 'Pending' ? (
            <div className="card p-6 text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3
                ${claim.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-red-100 dark:bg-red-950/40'}`}>
                {claim.status === 'Approved'
                  ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                  : <XCircle className="w-6 h-6 text-red-500" />
                }
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Claim {claim.status}</h3>
              {claim.approvedAmount && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  {formatCurrency(claim.approvedAmount)} approved
                </p>
              )}
              {claim.insurerComments && (
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{claim.insurerComments}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} id="review-form" className="card p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Decision
              </h2>

              {/* Status selection */}
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedStatus === 'Approved'
                      ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  <input
                    type="radio"
                    value="Approved"
                    {...register('status')}
                    className="sr-only"
                    id="status-approve"
                  />
                  <CheckCircle className={`w-4 h-4 ${selectedStatus === 'Approved' ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${selectedStatus === 'Approved' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500'}`}>
                    Approve
                  </span>
                </label>

                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedStatus === 'Rejected'
                      ? 'border-red-400 bg-red-50 dark:bg-red-950/40 dark:border-red-600'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  <input
                    type="radio"
                    value="Rejected"
                    {...register('status')}
                    className="sr-only"
                    id="status-reject"
                  />
                  <XCircle className={`w-4 h-4 ${selectedStatus === 'Rejected' ? 'text-red-500' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${selectedStatus === 'Rejected' ? 'text-red-700 dark:text-red-300' : 'text-slate-500'}`}>
                    Reject
                  </span>
                </label>
              </div>

              {/* Approved amount */}
              {selectedStatus === 'Approved' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                    Approved Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                    <Controller
                      name="approvedAmount"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="approved-amount"
                          type="number"
                          min="0"
                          placeholder={claim.claimAmount.toString()}
                          className="input-base pl-8"
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {/* Comments */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Comments
                </label>
                <textarea
                  {...register('insurerComments')}
                  id="insurer-comments"
                  rows={3}
                  placeholder="Add any notes or feedback for the patient..."
                  className="input-base resize-none text-sm"
                />
              </div>

              <Button
                type="submit"
                variant={selectedStatus === 'Rejected' ? 'danger' : 'primary'}
                fullWidth
                loading={updateMutation.isPending}
                id="save-review-btn"
              >
                {selectedStatus === 'Approved' ? 'Approve Claim' : 'Reject Claim'}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Decision"
        size="sm"
      >
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto
            ${pendingData?.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-red-100 dark:bg-red-950/40'}`}
          >
            {pendingData?.status === 'Approved'
              ? <CheckCircle className="w-6 h-6 text-emerald-500" />
              : <AlertTriangle className="w-6 h-6 text-red-500" />
            }
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {pendingData?.status === 'Approved' ? 'Approve this claim?' : 'Reject this claim?'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {pendingData?.status === 'Approved'
                ? `You are approving ${formatCurrency(claim.claimAmount)} claim${pendingData.approvedAmount ? ` for ${formatCurrency(pendingData.approvedAmount)}` : ''}.`
                : 'This action will notify the patient that their claim was rejected.'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button
              variant={pendingData?.status === 'Rejected' ? 'danger' : 'primary'}
              fullWidth
              loading={updateMutation.isPending}
              onClick={handleConfirm}
              id="confirm-review-btn"
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* Doc Preview Modal */}
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
                  const fallback = document.getElementById(`doc-error-fallback-${claim._id}`);
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id={`doc-error-fallback-${claim._id}`}
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
