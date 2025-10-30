import { useState } from 'react';
import { List } from 'lucide-react';
import { QuestionsDialog } from './QuestionsDialog';

export function SegmentManager({ onAddSegment }) {
  const [open, setOpen] = useState(false);

  // Handler to add question to wheel - include answers
  const handleAddToWheel = (q) => {
    onAddSegment({ 
      name: String(q.index), 
      description: q.question,
      answers: q.answers || undefined
    });
  };

  return (
    <div className="w-full">
      <button
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-realpage-orange to-realpage-orange/90 hover:from-realpage-orange hover:to-realpage-orange text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 border-2 border-realpage-orange/50"
        onClick={() => setOpen(true)}
      >
        <List className="w-6 h-6" />
        <span className="text-lg">Manage Questions</span>
      </button>
      <QuestionsDialog open={open} onClose={() => setOpen(false)} onAddToWheel={handleAddToWheel} />
    </div>
  );
}
