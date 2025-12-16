import { useState, useEffect } from 'react';
import { supabase, Guide } from '../lib/supabase';
import { Gift, Trash2, Eye, RefreshCw } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

interface AssignmentWithNames {
  guide_id: string;
  guide_name: string;
  assigned_to_name: string;
  has_viewed: boolean;
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [assignments, setAssignments] = useState<AssignmentWithNames[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState<'guides' | 'assignments'>('guides');

  useEffect(() => {
    fetchGuides();
    fetchAssignments();
  }, []);

  const fetchGuides = async () => {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .order('name');

    if (error) {
      setMessage('Error loading guides: ' + error.message);
    } else {
      setGuides(data || []);
    }
  };

  const fetchAssignments = async () => {
    const { data: assignmentData } = await supabase
      .from('assignments')
      .select('guide_id, assigned_to_id');

    if (!assignmentData) return;

    const withNames: AssignmentWithNames[] = [];

    for (const assignment of assignmentData) {
      const { data: guide } = await supabase
        .from('guides')
        .select('name, has_viewed')
        .eq('id', assignment.guide_id)
        .single();

      const { data: assigned } = await supabase
        .from('guides')
        .select('name')
        .eq('id', assignment.assigned_to_id)
        .single();

      if (guide && assigned) {
        withNames.push({
          guide_id: assignment.guide_id,
          guide_name: guide.name,
          assigned_to_name: assigned.name,
          has_viewed: guide.has_viewed
        });
      }
    }

    setAssignments(withNames.sort((a, b) => a.guide_name.localeCompare(b.guide_name)));
  };

  const deleteGuide = async (id: string) => {
    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage('Error deleting guide: ' + error.message);
    } else {
      setMessage('Guide deleted');
      fetchGuides();
      fetchAssignments();
    }
  };

  const resetAssignments = async () => {
    setLoading(true);

    await supabase
      .from('assignments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    await supabase
      .from('guides')
      .update({ has_viewed: false })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    setMessage('All assignments reset! Guides can pick again.');
    fetchAssignments();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-green-900 to-red-900 p-8">
      <div className="snowflakes" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="snowflake">❅</div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
        >
          ← Back
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-8 h-8 text-yellow-300" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-green-500/50 rounded-lg text-white animate-fade-in">
              {message}
            </div>
          )}

          <div className="flex gap-4 mb-6 border-b border-white/20">
            <button
              onClick={() => setTab('guides')}
              className={`px-6 py-2 font-semibold transition-all ${
                tab === 'guides'
                  ? 'text-yellow-300 border-b-2 border-yellow-300'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Guides ({guides.length})
            </button>
            <button
              onClick={() => setTab('assignments')}
              className={`px-6 py-2 font-semibold transition-all ${
                tab === 'assignments'
                  ? 'text-yellow-300 border-b-2 border-yellow-300'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Assignments ({assignments.length})
            </button>
          </div>

          {tab === 'guides' && (
            <div>
              <div className="space-y-2">
                {guides.map((guide) => (
                  <div
                    key={guide.id}
                    className="flex justify-between items-center p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                  >
                    <div className="flex-1">
                      <p className="text-white font-semibold">{guide.name}</p>
                      <p className="text-white/70 text-sm">Password: <span className="font-mono bg-black/30 px-2 py-1 rounded">{guide.password}</span></p>
                    </div>
                    <button
                      onClick={() => deleteGuide(guide.id)}
                      className="p-2 hover:bg-red-500/50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'assignments' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-white/70">
                  {assignments.length} / {guides.length} assignments completed
                </p>
                <button
                  onClick={resetAssignments}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className="w-5 h-5" />
                  Reset All
                </button>
              </div>

              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <div className="text-center p-8 text-white/70">
                    No assignments yet. Guides will make their picks!
                  </div>
                ) : (
                  assignments.map((assignment, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-white font-semibold">{assignment.guide_name}</p>
                          <p className="text-green-300 text-lg mt-1">→ {assignment.assigned_to_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {assignment.has_viewed && (
                            <div className="flex items-center gap-1 text-yellow-300">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">Viewed</span>
                            </div>
                          )}
                          <span className="text-white/50 text-sm">
                            {assignment.has_viewed ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
