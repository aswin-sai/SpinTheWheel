import { useState, useEffect } from 'react';
import { SpinWheel } from './components/SpinWheel';
import { SegmentManager } from './components/SegmentManager';
import { History } from './components/History';
import { Trophy, Sparkles } from 'lucide-react';

interface Topic {
  name: string;
  description: string;
}

const defaultSegments: Topic[] = [
  { name: 'Vision', description: '' },
  { name: 'Values', description: '' },
  { name: 'CSR', description: '' },
  { name: 'Innovation', description: '' },
  { name: 'Leadership', description: '' },
  { name: 'Culture', description: '' }
];

function App() {
  const [segments, setSegments] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('wheelSegments');
    // Validate loaded segments are objects with name/description
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.every(s => typeof s.name === 'string')) {
          return arr;
        }
      } catch {}
    }
    return defaultSegments;
  });

  const [history, setHistory] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('wheelHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wheelSegments', JSON.stringify(segments));
  }, [segments]);

  useEffect(() => {
    localStorage.setItem('wheelHistory', JSON.stringify(history));
  }, [history]);

  // Accepts Topic object only
  const handleAddSegment = (segment: Topic) => {
    if (
      segment.name.trim() &&
      !segments.some(s => s.name.trim().toLowerCase() === segment.name.trim().toLowerCase())
    ) {
      setSegments([...segments, { name: segment.name.trim(), description: segment.description || '' }]);
    }
  };

  const handleRemoveSegment = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSegments(defaultSegments);
    setHistory([]);
  };

  const handleSpinComplete = (result: string) => {
    // Find the topic object by name
    const winner = segments.find(s => s.name === result);
    if (winner) {
      setHistory([winner, ...history.slice(0, 4)]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-realpage-blue via-realpage-blue/90 to-gray-900 text-white overflow-x-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpage-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="relative py-6 px-4 border-b-4 border-realpage-orange bg-gradient-to-r from-realpage-blue via-realpage-blue to-realpage-blue/95 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-realpage-orange/10 to-transparent animate-pulse"></div>

          <div className="container mx-auto relative">
            <div className="flex items-center justify-center gap-4 mb-3" >
              {/* Use public folder path for Vercel/static hosting */}
              <img
                src="/RealPageLogo.png"
                alt="Header Logo"
                style={{ height: '48px', width: '288px' }}
              />
              <div className="animate-float">
                <Trophy className="w-10 h-10 text-realpage-orange drop-shadow-lg" />
              </div>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-white via-realpage-orange to-white bg-clip-text text-transparent drop-shadow-2xl">
                    Spin the Wheel
                  </span>
                </h1>
              </div>
              <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-10 h-10 text-realpage-orange drop-shadow-lg" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-2xl font-semibold text-white/95">Career Elevate</p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 rounded-full bg-realpage-orange animate-pulse"></div>
                <p className="text-sm font-medium text-white/90 tracking-wider">
                  Do You <span className="text-realpage-orange font-bold">REAL</span>-ly Know?
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
            <div className="lg:col-span-2 flex justify-center">
              <SpinWheel
                segments={segments}
                onSpinComplete={handleSpinComplete}
              />
            </div>

            <div className="space-y-6">
              <SegmentManager
                segments={segments}
                onAddSegment={handleAddSegment}
                onRemoveSegment={handleRemoveSegment}
                onClearAll={handleClearAll}
              />

              <History history={history} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
