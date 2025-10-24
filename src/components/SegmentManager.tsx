import { useState } from 'react';
import { Plus, X, RotateCcw, Settings } from 'lucide-react';

interface Topic {
  name: string;
  description: string;
}

interface SegmentManagerProps {
  segments: Topic[];
  onAddSegment: (segment: Topic) => void;
  onRemoveSegment: (index: number) => void;
  onClearAll: () => void;
}

export function SegmentManager({
  segments,
  onAddSegment,
  onRemoveSegment,
  onClearAll,
}: SegmentManagerProps) {
  const [inputValue, setInputValue] = useState('');
  const [descValue, setDescValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddSegment({ name: inputValue, description: descValue });
      setInputValue('');
      setDescValue('');
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-realpage-blue/40 via-realpage-blue/60 to-realpage-blue/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-realpage-orange/40 hover:border-realpage-orange/60 transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.1),transparent_50%)] rounded-2xl"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-realpage-orange/20 rounded-lg">
              <Settings className="w-6 h-6 text-realpage-orange" />
            </div>
            <h2 className="text-2xl font-bold text-white">Manage Topics</h2>
          </div>
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-realpage-orange/20 rounded-xl transition-all border-2 border-white/20 hover:border-realpage-orange/50 hover:scale-105 active:scale-95"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add new Index."
              className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-realpage-orange focus:border-realpage-orange/50 transition-all backdrop-blur-sm hover:bg-white/15"
              maxLength={20}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              placeholder="Enter a question."
              className="flex-1 px-4 py-2 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-realpage-orange focus:border-realpage-orange/50 transition-all backdrop-blur-sm hover:bg-white/15"
              maxLength={80}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-5 py-3 bg-gradient-to-br from-realpage-orange via-realpage-orange to-realpage-orange/80 hover:from-realpage-orange hover:to-realpage-orange disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg border-2 border-white/30 disabled:border-white/10"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-realpage-orange/50 scrollbar-track-white/10">
          {segments.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-xl border-2 border-dashed border-white/20">
              <p className="text-white/60 text-lg font-semibold">No topics yet</p>
              <p className="text-white/40 text-sm mt-2">Add your first topic above</p>
            </div>
          ) : (
            segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-white/10 hover:border-realpage-orange/50 transition-all group hover:bg-white/10 hover:shadow-lg"
              >
                <span className="text-white font-semibold text-base">
                  {segment.name}
                  {segment.description && (
                    <span className="ml-2 text-white/60 text-sm font-normal">({segment.description})</span>
                  )}
                </span>
                <button
                  onClick={() => onRemoveSegment(index)}
                  className="text-white/50 hover:text-realpage-orange transition-all opacity-0 group-hover:opacity-100 p-2 hover:bg-realpage-orange/20 rounded-lg hover:scale-110 active:scale-95"
                  title="Remove topic"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t-2 border-white/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white/80">
              Total Topics:
            </p>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-realpage-orange/20 to-realpage-orange/30 rounded-xl border-2 border-realpage-orange/40 shadow-lg">
              <span className="text-2xl font-black text-realpage-orange drop-shadow-lg">{segments.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
