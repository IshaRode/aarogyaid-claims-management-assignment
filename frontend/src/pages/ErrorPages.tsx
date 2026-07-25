
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-violet-500 mb-4">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
          You don't have permission to access this page. Please log in with the correct account.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
