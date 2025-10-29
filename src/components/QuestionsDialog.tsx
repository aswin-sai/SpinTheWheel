import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface Question {
  index: number;
  question: string;
}

interface QuestionsDialogProps {
  open: boolean;
  onClose: () => void;
  onAddToWheel?: (question: Question) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export function QuestionsDialog({ open, onClose, onAddToWheel }: QuestionsDialogProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add/edit form state
  const [newQuestion, setNewQuestion] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  // Fetch questions
  const fetchQuestions = () => {
    setLoading(true);
    setError(null);
    fetch(`${SUPABASE_URL}/rest/v1/questions?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!open) return;
    fetchQuestions();
  }, [open]);

  // Add question (POST)
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setLoading(true);
    setError(null);
    // Find max index and increment
    const maxIndex = questions.length > 0 ? Math.max(...questions.map(q => q.index)) : 0;
    const nextIndex = maxIndex + 1;
    await fetch(`${SUPABASE_URL}/rest/v1/questions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify([{ index: nextIndex, question: newQuestion }]),
    });
    setNewQuestion('');
    fetchQuestions();
  };

  // Edit question (PUT)
  const handleEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editIndex === null || !editValue.trim()) return;
    setLoading(true);
    setError(null);
    await fetch(`${SUPABASE_URL}/rest/v1/questions?index=eq.${editIndex}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ question: editValue }),
    });
    setEditIndex(null);
    setEditValue('');
    fetchQuestions();
  };

  // Delete question (DELETE)
  const handleDeleteQuestion = async (index: number) => {
    setLoading(true);
    setError(null);
    await fetch(`${SUPABASE_URL}/rest/v1/questions?index=eq.${index}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    fetchQuestions();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[350px] max-w-[90vw]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-realpage-orange">Questions</h2>
          <button
            onClick={onClose}
            className="text-realpage-orange hover:text-red-600 font-bold text-lg"
            title="Close"
          >
            ×
          </button>
        </div>
        {/* Add new question */}
        <form onSubmit={handleAddQuestion} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Enter new question"
            className="flex-1 px-3 py-2 border rounded"
            maxLength={200}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-realpage-orange text-white rounded font-bold"
            disabled={loading || !newQuestion.trim()}
          >
            Add
          </button>
        </form>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">Error: {error}</div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {questions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No questions found.</div>
            ) : (
              questions.map((q) =>
                editIndex === q.index ? (
                  <form key={q.index} onSubmit={handleEditQuestion} className="p-4 rounded-xl bg-yellow-50 border border-yellow-300 flex gap-2 items-center">
                    <span className="font-semibold text-realpage-orange">Index: {q.index}</span>
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                      maxLength={200}
                    />
                    <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded font-bold">Save</button>
                    <button type="button" className="px-3 py-1 bg-gray-400 text-white rounded font-bold" onClick={() => { setEditIndex(null); setEditValue(''); }}>Cancel</button>
                  </form>
                ) : (
                  <div key={q.index} className="p-4 rounded-xl bg-realpage-blue/10 border border-realpage-orange/30 flex items-center gap-3">
                    <div>
                      <div className="font-semibold text-realpage-orange">Index: {q.index}</div>
                      <div className="text-gray-700 text-sm mt-1">{q.question}</div>
                    </div>
                    <button
                      className="ml-auto px-3 py-1 bg-blue-600 text-white rounded font-bold"
                      onClick={() => { setEditIndex(q.index); setEditValue(q.question); }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded font-bold"
                      onClick={() => handleDeleteQuestion(q.index)}
                    >
                      Delete
                    </button>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded font-bold flex items-center gap-1"
                      title="Add to Wheel"
                      onClick={() => {
                        if (onAddToWheel) {
                          onAddToWheel(q);
                        }
                      }}
                    >
                      <PlusCircle className="w-5 h-5" />
                      Add
                    </button>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}