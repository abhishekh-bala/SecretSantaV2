import { useState, useEffect } from 'react';
import { supabase, Guide } from '../lib/supabase';
import { Gift, PartyPopper, LogOut, Shuffle } from 'lucide-react';

interface RevealPageProps {
  guide: Guide;
  onLogout: () => void;
}

export default function RevealPage({ guide, onLogout }: RevealPageProps) {
  const [availableGuides, setAvailableGuides] = useState<Guide[]>([]);
  const [assignedGuide, setAssignedGuide] = useState<Guide | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [picking, setPicking] = useState(false);
  const [currentSpinName, setCurrentSpinName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: assignment } = await supabase
      .from('assignments')
      .select('assigned_to_id')
      .eq('guide_id', guide.id)
      .maybeSingle();

    if (assignment) {
      const { data: assignedTo } = await supabase
        .from('guides')
        .select('*')
        .eq('id', assignment.assigned_to_id)
        .single();

      setAssignedGuide(assignedTo);
      setRevealed(true);
    }

    const { data: allGuides } = await supabase
      .from('guides')
      .select('*')
      .neq('id', guide.id);

    const { data: usedGuides } = await supabase
      .from('assignments')
      .select('assigned_to_id');

    const usedIds = usedGuides?.map(a => a.assigned_to_id) || [];
    const available = allGuides?.filter(g => !usedIds.includes(g.id)) || [];

    setAvailableGuides(available);
    setLoading(false);
  };

  const startPicking = async () => {
    if (availableGuides.length === 0) {
      setError('All names have been taken!');
      return;
    }

    setPicking(true);
    setCurrentSpinName('');

    const spinDuration = 10000;
    const spinFrames = 30;
    const frameInterval = spinDuration / spinFrames;
    let frame = 0;

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableGuides.length);
      setCurrentSpinName(availableGuides[randomIndex].name);
      frame++;

      if (frame >= spinFrames) {
        clearInterval(spinInterval);

        const finalIndex = Math.floor(Math.random() * availableGuides.length);
        const selected = availableGuides[finalIndex];
        setCurrentSpinName(selected.name);

        assignName(selected);
      }
    }, frameInterval);
  };

  const assignName = async (selectedGuide: Guide) => {
    try {
      const { error: err } = await supabase
        .from('assignments')
        .insert([{
          guide_id: guide.id,
          assigned_to_id: selectedGuide.id
        }]);

      if (err) {
        if (err.message.includes('duplicate')) {
          setError('This name was just taken by someone else! Try again.');
          await fetchData();
        } else {
          setError('Error assigning name: ' + err.message);
        }
        setPicking(false);
        return;
      }

      setAssignedGuide(selectedGuide);
      setRevealed(true);

      await supabase
        .from('guides')
        .update({ has_viewed: true })
        .eq('id', guide.id);

      setPicking(false);
    } catch (err) {
      setError('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setPicking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="snowflakes" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome, {guide.name}! 🎅
          </h1>
          <p className="text-white/90 text-lg">
            Team WolfPack 2025 Secret Santa Picker
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {!revealed ? (
            <div className="text-center">
              {!picking ? (
                <>
                  <div className="mb-8 animate-bounce">
                    <Gift className="w-32 h-32 text-yellow-300 mx-auto drop-shadow-glow" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Click the button and watch the magic happen!
                  </h2>
                  <p className="text-white/80 mb-6 text-lg">
                    Names available: {availableGuides.length}
                  </p>
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/50 rounded-lg text-white">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={startPicking}
                    disabled={availableGuides.length === 0}
                    className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold text-xl transition-all transform hover:scale-110 shadow-lg animate-pulse-slow disabled:opacity-50 flex items-center gap-3 mx-auto"
                  >
                    <Shuffle className="w-6 h-6" />
                    Start Picking 🎁
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="mb-8 h-24 flex items-center justify-center">
                    <div className="text-5xl font-bold text-yellow-300 animate-spin-slow drop-shadow-glow">
                      {currentSpinName || '...'}
                    </div>
                  </div>
                  <p className="text-white text-lg animate-pulse">
                    Spinning the wheel... 🌀
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <PartyPopper className="w-20 h-20 text-yellow-300 mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl font-bold text-white mb-4">
                You're the Secret Santa for:
              </h2>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-8 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform">
                <p className="text-5xl font-bold text-white drop-shadow-lg">
                  {assignedGuide?.name}
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 mb-6">
                <p className="text-white text-lg leading-relaxed">
                  🎄 Remember to keep it a secret! <br />
                  🎁 Get them something special! <br />
                  ✨ Make their Christmas magical!
                </p>
              </div>
              <button
                onClick={onLogout}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all flex items-center gap-2 mx-auto"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/70 text-sm">
            🎅 Ho Ho Ho! Merry Christmas! 🎄
          </p>
          <p className="text-white/50 text-xs mt-2">
            Designed and Developed by Abhishekh Dey
          </p>
        </div>
      </div>
    </div>
  );
}
