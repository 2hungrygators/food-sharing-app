import React, { useState } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card-bg border border-border p-10 rounded-sm"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif italic text-accent mb-2">Nourish</h1>
          <p className="text-text-dim text-sm uppercase tracking-widest">Accountability Circle</p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-text-dim mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-border p-3 text-sm focus:border-accent outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-text-dim mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg border border-border p-3 text-sm focus:border-accent outline-none transition-colors"
              required
            />
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>}

          <button
            type="submit"
            className="w-full bg-accent text-bg p-4 text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-card-bg px-4 text-text-dim">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-border p-4 text-xs uppercase tracking-[0.2em] hover:bg-bg transition-colors flex items-center justify-center gap-3"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-4 h-4" />
          Google
        </button>

        <p className="text-center mt-8 text-[10px] uppercase tracking-widest text-text-dim">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
