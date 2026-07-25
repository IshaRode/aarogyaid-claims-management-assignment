import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User as UserIcon, Activity, Sparkles, Shield, Zap, UserCheck, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import type { UserRole } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['patient', 'insurer'] as const),
});

type RegisterForm = z.infer<typeof registerSchema>;

const features = [
  { icon: Shield, title: 'Instant Account Creation', desc: 'Get started in seconds as a Patient or Insurer' },
  { icon: Zap, title: 'Real-time Claims Tracking', desc: 'Seamless claim submission and live status updates' },
  { icon: Sparkles, title: 'AI-Powered Platform', desc: 'Automated claim risk analysis and summaries' },
];

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'patient',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await authService.register(data.name, data.email, data.password, data.role as UserRole);
      login(result.access_token, result.user);
      toast.success(`Account created! Welcome, ${result.user.name} 🎉`);
      navigate(result.user.role === 'insurer' ? '/insurer' : '/patient');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-300 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">Aarogya ID</span>
              <span className="text-xs text-blue-200 block font-medium">Claims Management</span>
            </div>
          </div>

          <div className="space-y-8 my-auto">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold tracking-tight leading-tight"
              >
                Join the future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-teal-200">
                  Health Claims Management
                </span>
              </motion.h1>
              <p className="mt-4 text-blue-100 text-base max-w-md leading-relaxed">
                Create an account to submit medical claims, track approvals in real time, or manage policyholder reviews as an insurer.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-blue-200 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-blue-200 border-t border-white/10 pt-6">
            © {new Date().getFullYear()} Aarogya ID Platform. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Header */}
          <div>
            <div className="flex items-center gap-2.5 mb-6 lg:hidden">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">Aarogya ID</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create an account
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Sign up to get started with claims management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                I am registering as a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'patient')}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border font-medium text-sm transition-all ${
                    selectedRole === 'patient'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" /> Patient
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'insurer')}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border font-medium text-sm transition-all ${
                    selectedRole === 'insurer'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Insurer
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="e.g. Ananya Roy"
                  className={`input-base !pl-10 ${errors.name ? 'error' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className={`input-base !pl-10 ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-base !pl-10 !pr-10 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={isLoading}
              className="mt-2"
            >
              Create Account
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
