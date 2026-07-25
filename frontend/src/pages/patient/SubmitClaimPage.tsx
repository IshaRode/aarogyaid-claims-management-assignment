import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, CheckCircle2, Sparkles,
  TrendingUp, ArrowLeft, CloudUpload,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { claimsService } from '../../services/claims.service';
import { Button } from '../../components/ui/Button';
import { Breadcrumb } from '../../components/layout/Breadcrumb';
import { getRiskLevel } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const schema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  claimAmount: z.coerce.number().positive('Amount must be positive'),
  description: z.string().min(20, 'Please provide at least 20 characters of description'),
});

type FormData = z.infer<typeof schema>;

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function SubmitClaimPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [aiSummaryPreview, setAiSummaryPreview] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      patientName: user?.name || '',
      email: user?.email || '',
    },
  });

  const claimAmount = watch('claimAmount');
  const riskLevel = claimAmount > 0 ? getRiskLevel(claimAmount) : null;

  const submitMutation = useMutation({
    mutationFn: (data: FormData) =>
      claimsService.createClaim({
        ...data,
        uploadedDocument: uploadedUrl || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Claim submitted successfully! 🎉');
      navigate('/patient');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to submit claim');
    },
  });

  const handleFileDrop = useCallback(
    async (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error('Only PDF, JPG, JPEG, PNG files are allowed');
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error('File size must be under 10MB');
        return;
      }

      setUploadedFile(file);
      setIsUploading(true);

      try {
        const result = await claimsService.uploadDocument(file);
        setUploadedUrl(result.url);
        // Generate mock AI preview
        setAiSummaryPreview(
          `Document "${file.name}" analyzed. AI detected: ${file.type === 'application/pdf' ? 'Medical PDF document' : 'Medical image/receipt'}. Document appears ${file.size < 500000 ? 'complete' : 'comprehensive'} and ready for claim processing.`
        );
        toast.success('Document uploaded successfully!');
      } catch {
        toast.error('Upload failed. Please try again.');
        setUploadedFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileDrop(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileDrop(file);
  };

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  const riskColors: Record<string, string> = {
    Low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-200',
    High: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: 'Dashboard', href: '/patient' }, { label: 'Submit Claim' }]} />
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Submit New Claim</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Fill in the details and upload your supporting document</p>
          </div>
        </div>
      </div>

      <form onSubmit={(handleSubmit as any)(onSubmit)} id="submit-claim-form" className="space-y-6">
        {/* Patient Info */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Patient Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('patientName')}
                id="patient-name"
                className={`input-base ${errors.patientName ? 'error' : ''}`}
                placeholder="Priya Sharma"
              />
              {errors.patientName && (
                <p className="text-xs text-red-500 mt-1">{errors.patientName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('email')}
                id="patient-email"
                type="email"
                className={`input-base ${errors.email ? 'error' : ''}`}
                placeholder="priya@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Claim Details */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Claim Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Claim Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
              <Controller
                name="claimAmount"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    id="claim-amount"
                    type="number"
                    min="1"
                    step="1"
                    className={`input-base pl-8 ${errors.claimAmount ? 'error' : ''}`}
                    placeholder="5000"
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                )}
              />
            </div>
            {errors.claimAmount && (
              <p className="text-xs text-red-500 mt-1">{errors.claimAmount.message}</p>
            )}

            {/* Risk indicator */}
            <AnimatePresence>
              {riskLevel && !isNaN(claimAmount) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 flex items-center gap-2"
                >
                  <TrendingUp className={`w-3.5 h-3.5 ${riskLevel === 'Low' ? 'text-emerald-500' : riskLevel === 'Medium' ? 'text-amber-500' : 'text-red-500'}`} />
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${riskColors[riskLevel]}`}>
                    {riskLevel} Risk
                  </span>
                  <span className="text-xs text-slate-400">
                    {riskLevel === 'Low' ? '(Under ₹10,000)' : riskLevel === 'Medium' ? '(₹10,000–₹50,000)' : '(Above ₹50,000)'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description')}
              id="claim-description"
              rows={4}
              className={`input-base resize-none ${errors.description ? 'error' : ''}`}
              placeholder="Describe your medical treatment, diagnosis, and reason for the claim..."
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Document Upload */}
        <div className="card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
            Supporting Document
          </h2>

          <AnimatePresence mode="wait">
            {uploadedFile ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-emerald-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setUploadedUrl(null);
                    setAiSummaryPreview(null);
                  }}
                  className="p-1 text-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.label
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                htmlFor="file-upload"
                className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer
                  ${isDragging
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                  ${isDragging ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  <CloudUpload className={`w-6 h-6 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {isUploading ? 'Uploading...' : 'Drop your file here, or browse'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, JPEG, PNG up to 10MB</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={onFileChange}
                />
              </motion.label>
            )}
          </AnimatePresence>

          {/* AI Summary Preview */}
          <AnimatePresence>
            {aiSummaryPreview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-100 dark:border-violet-900/50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                    AI Assistant (Preview)
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{aiSummaryPreview}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={submitMutation.isPending}
            disabled={submitMutation.isPending || isUploading}
            fullWidth
            id="submit-claim-btn"
          >
            Submit Claim
          </Button>
        </div>
      </form>
    </div>
  );
}
