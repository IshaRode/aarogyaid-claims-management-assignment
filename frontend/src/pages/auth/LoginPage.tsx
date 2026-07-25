import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Activity, Sparkles, Shield, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  { icon: Shield, title: 'Secure Claims', desc: 'End-to-end encrypted claim processing' },
  { icon: Zap, title: 'Instant Processing', desc: 'Real-time status updates and notifications' },
  { icon: Sparkles, title: 'AI Insights', desc: 'Intelligent risk analysis and summaries' },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<'patient' | 'insurer'>('patient');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await authService.login(data.email, data.password);
      login(result.access_token, result.user);
      toast.success(`Welcome back, ${result.user.name}! 👋`);
      navigate(result.user.role === 'insurer' ? '/insurer' : '/patient');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-violet-700">
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-white">AarogyaID</span>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center mt-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold text-white leading-tight">
                Health Insurance<br />
                <span className="text-blue-200">Claims Made Simple</span>
              </h1>
              <p className="mt-4 text-blue-100 text-lg max-w-sm leading-relaxed">
                The modern platform connecting patients and insurers for faster, transparent claim processing.
              </p>
            </motion.div>

            {/* Features */}
            <div className="mt-10 space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <feature.icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{feature.title}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex gap-8">
            {[
              { value: '10K+', label: 'Claims Processed' },
              { value: '98%', label: 'Success Rate' },
              { value: '< 24h', label: 'Avg. Review Time' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-blue-200 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">AarogyaID</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in to your account to continue</p>
          </div>

          {/* Role selection buttons */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveRole('patient')}
              className={`flex-1 text-xs py-2 px-3 rounded-xl border font-medium transition-all ${
                activeRole === 'patient'
                  ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:border-blue-700 dark:text-blue-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              👤 Patient
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('insurer')}
              className={`flex-1 text-xs py-2 px-3 rounded-xl border font-medium transition-all ${
                activeRole === 'insurer'
                  ? 'border-violet-600 bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:border-violet-700 dark:text-violet-400 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`}
            >
              🏥 Insurer
            </button>
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="px-3 text-xs text-slate-400">or sign in manually</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="login-form">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  id="login-email"
                  autoComplete="email"
                  placeholder={`${activeRole}@aarogyaid.com`}
                  className={`input-base !pl-10 ${errors.email ? 'error' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`input-base !pl-10 !pr-10 ${errors.password ? 'error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
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
              loading={isLoading}
              fullWidth
              size="lg"
              className="mt-2"
              id="login-submit"
            >
              Sign in
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Protected by enterprise-grade security · SOC2 compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
}
