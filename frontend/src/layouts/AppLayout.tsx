
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

interface ProtectedLayoutProps {
  allowedRole: 'patient' | 'insurer';
}

export function ProtectedLayout({ allowedRole }: ProtectedLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl animate-pulse" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) return <Navigate to="/unauthorized" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />
      <motion.main
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
}

export function AuthLayout() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'insurer' ? '/insurer' : '/patient'} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <Outlet />
    </motion.div>
  );
}
