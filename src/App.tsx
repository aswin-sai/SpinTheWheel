import { useState, useEffect } from 'react';
import { SpinWheel } from './components/SpinWheel';
import { SegmentManager } from './components/SegmentManager';
import { History } from './components/History';
import { Trophy } from 'lucide-react';

interface Topic {
  name: string;
  description: string;
}

function Logos({ fullscreen = false }: { fullscreen?: boolean }) {
  // Use fixed positioning in fullscreen, absolute otherwise
  return (
    <>
      <img
        src="/RealPage.png"
        alt="Header Logo"
        style={{
          height: fullscreen ? '150px' : '100px',
          width: fullscreen ? '500px' : '330px',
          position: fullscreen ? 'fixed' : 'absolute',
          left: fullscreen ? -30 : -10,
          top: fullscreen ? 80 : '50%', // was 32, now 80 for more space from top
          transform: fullscreen ? 'none' : 'translateY(-50%)',
          zIndex: 101,
          pointerEvents: 'none',
        }}
      />
      <img
        src="/CareerElevate.jpg"
        alt="Header Logo"
        style={{
          height: fullscreen ? '170px' : '140px',
          width: fullscreen ? '190px' : '160px',
          position: fullscreen ? 'fixed' : 'absolute',
          right: fullscreen ? 32 : undefined,
          left: fullscreen ? 1300 : 1300,
          top: fullscreen ? 80 : '50%', // was 32, now 80 for more space from top
          transform: fullscreen ? 'none' : 'translateY(-50%)',
          zIndex: 101,
          pointerEvents: 'none',
        }}
      />
    </>
  );
}

function App() {
  // Wheel starts empty
  const [segments, setSegments] = useState<Topic[]>([]);

  // Persist names of topics permanently removed via the UI (clicking X)
  const [removedTopics, setRemovedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('removedTopics');
    return saved ? JSON.parse(saved) : [];
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

  useEffect(() => {
    localStorage.setItem('removedTopics', JSON.stringify(removedTopics));
  }, [removedTopics]);

  // Accepts Topic object only
  const handleAddSegment = (segment: Topic) => {
    const name = segment.name.trim();
    if (
      name &&
      !segments.some(s => s.name.trim().toLowerCase() === name.toLowerCase())
    ) {
      setSegments([...segments, { name, description: segment.description || '' }]);
    }
  };

  const handleRemoveSegment = (index: number) => {
    const seg = segments[index];
    if (!seg) return;
    setSegments(segments.filter((_, i) => i !== index));
    if (!removedTopics.includes(seg.name)) {
      setRemovedTopics([...removedTopics, seg.name]);
    }
  };

  const handleClearAll = () => {
    setSegments([]);
    setHistory([]);
  };

  const handleSpinComplete = (result: string) => {
    const winner = segments.find(s => s.name === result);
    if (winner) {
      setHistory([winner, ...history.slice(0, 4)]);
      setSegments(segments.filter(s => s.name !== result));
    }
  };

  const handleEditSegment = (index: number, updatedSegment: Topic) => {
    setSegments(segments.map((seg, i) => (i === index ? updatedSegment : seg)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-realpage-blue via-realpage-blue/90 to-gray-900 text-white overflow-x-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpage-orange rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-realpage-orange/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="relative py-8 px-4 border-b-4 border-realpage-orange bg-gradient-to-r from-realpage-blue via-realpage-blue to-realpage-blue/95 shadow-2xl glow-orange">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-realpage-orange/10 to-transparent animate-pulse"></div>
          <div className="container mx-auto relative">
            <Logos />

            <div className="flex items-center justify-center gap-3 md:gap-4 mb-4">
              <div className="animate-float hidden sm:block">
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-realpage-orange drop-shadow-2xl filter brightness-110" />
              </div>
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-white via-realpage-orange to-white bg-clip-text text-transparent drop-shadow-2xl">
                    Do You REAL-LY Know?
                  </span>
                </h1>
              </div>
              <div className="animate-float hidden sm:block" style={{ animationDelay: '0.5s' }}>
                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-realpage-orange drop-shadow-2xl filter brightness-110 transform scale-x-[-1]" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-white/10 via-realpage-orange/20 to-white/10 backdrop-blur-sm border-2 border-realpage-orange/30 shadow-lg">
                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-realpage-orange animate-pulse shadow-lg shadow-realpage-orange/50"></div>
                <p className="text-lg md:text-xl lg:text-2xl font-bold text-white/95 tracking-wide">
                  Career Elevate
                </p>
                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-realpage-orange animate-pulse shadow-lg shadow-realpage-orange/50"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-start max-w-7xl mx-auto">
            <div className="lg:col-span-2 flex justify-center items-center min-h-[500px]">
              <SpinWheel
                segments={segments}
                onSpinComplete={handleSpinComplete}
                LogosComponent={(props: any) => <Logos {...props} fullscreen />}
              />
            </div>

            <div className="space-y-6 w-full">
              <SegmentManager
                onAddSegment={handleAddSegment}
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

  