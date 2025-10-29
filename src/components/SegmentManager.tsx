import { useState } from 'react';
import { List } from 'lucide-react';
import { QuestionsDialog } from './QuestionsDialog';

export function SegmentManager({ onAddSegment }) {
  const [open, setOpen] = useState(false);

  // Handler to add question to wheel
  const handleAddToWheel = (q) => {
    onAddSegment({ name: String(q.index), description: q.question });
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 px-6 py-3 bg-realpage-orange text-white rounded-xl font-bold shadow-lg hover:bg-realpage-orange/80 transition-all"
        onClick={() => setOpen(true)}
      >
        <List className="w-5 h-5" />
        Questions
      </button>
      <QuestionsDialog open={open} onClose={() => setOpen(false)} onAddToWheel={handleAddToWheel} />
    </div>
  );
}
