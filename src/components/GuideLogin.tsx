import { useState } from 'react';
import { supabase, Guide } from '../lib/supabase';
import { Lock, Gift } from 'lucide-react';

interface GuideLoginProps {
  onLogin: (guide: Guide) => void;
  onAdminAccess: () => void;
}

export default function GuideLogin({ onLogin, onAdminAccess }: GuideLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password === 'santa2024admin') {
      onAdminAccess();
      return;
    }

    const { data, error: err } = await supabase
      .from('guides')
      .select('*')
      .eq('password', password)
      .maybeSingle();

    if (err || !data) {
      setError('Invalid password. Please try again!');
    } else {
      onLogin(data);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="snowflakes" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-bounce-slow">
          <Gift className="w-20 h-20 text-yellow-300 mx-auto mb-4 drop-shadow-glow" />
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg animate-pulse-slow">
            Secret Santa
          </h1>
          <p className="text-xl text-white/90">Christmas 2024</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 transform hover:scale-105 transition-transform">
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-white font-semibold mb-2">
                Enter Your Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/50"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/50 rounded-lg text-white text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg"
            >
              {loading ? 'Checking...' : '🎄 Reveal My Secret Santa 🎄'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Use the password provided to you by the administrator
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-white/50 text-xs">
            Made with ❤️ for the holiday season
          </p>
        </div>
      </div>
    </div>
  );
}
