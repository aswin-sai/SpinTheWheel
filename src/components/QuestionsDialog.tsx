import { useEffect, useState } from 'react';
import { PlusCircle, List } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-realpage-blue flex items-center gap-2">
            <List className="w-6 h-6 text-realpage-orange" />
            Questions Manager
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 font-bold text-2xl rounded-lg transition-all hover:scale-110 active:scale-95 shadow-lg"
            title="Close"
          >
            ×
          </button>
        </div>
        {/* Add new question */}
        <form onSubmit={handleAddQuestion} className="mb-6 flex gap-3">
          <input
            type="text"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Type a new question..."
            className="flex-1 px-4 py-3 border-2 border-gray-300 focus:border-realpage-orange focus:outline-none rounded-xl text-gray-800 font-medium transition-all"
            maxLength={200}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-realpage-orange to-realpage-orange/90 hover:from-realpage-orange hover:to-realpage-orange text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={loading || !newQuestion.trim()}
          >
            Add
          </button>
        </form>
        {loading ? (
          <div className="text-center text-gray-500 py-8 font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 font-semibold">Error: {error}</div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-realpage-orange/50 scrollbar-track-gray-200">
            {questions.length === 0 ? (
              <div className="text-center text-gray-400 py-12 font-semibold text-lg">No questions found. Add your first question above!</div>
            ) : (
              questions.map((q) =>
                editIndex === q.index ? (
                  <form key={q.index} onSubmit={handleEditQuestion} className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-400 shadow-md">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-realpage-orange text-lg">#{q.index}</span>
                        <span className="text-yellow-600 text-sm font-semibold">Editing...</span>
                      </div>
                      <input
                        type="text"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-yellow-400 focus:border-yellow-500 focus:outline-none rounded-lg text-gray-800 font-medium"
                        maxLength={200}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-md">Save</button>
                        <button type="button" className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-md" onClick={() => { setEditIndex(null); setEditValue(''); }}>Cancel</button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div key={q.index} className="p-4 rounded-xl bg-gradient-to-br from-realpage-blue/5 to-realpage-blue/10 border-2 border-realpage-orange/20 hover:border-realpage-orange/40 transition-all shadow-md hover:shadow-lg group">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-realpage-orange text-white font-black text-lg rounded-lg shadow-md">
                        {q.index}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 text-base font-semibold break-words">{q.question}</div>
                      </div>
                      <div className="flex-shrink-0 flex gap-2">
                        <button
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-md text-sm"
                          onClick={() => { setEditIndex(q.index); setEditValue(q.question); }}
                          title="Edit question"
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-md text-sm"
                          onClick={() => handleDeleteQuestion(q.index)}
                          title="Delete question"
                        >
                          Delete
                        </button>
                        <button
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center gap-1 transition-all hover:scale-105 active:scale-95 shadow-md text-sm"
                          title="Add to Wheel"
                          onClick={() => {
                            if (onAddToWheel) {
                              onAddToWheel(q);
                              onClose();
                            }
                          }}
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
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