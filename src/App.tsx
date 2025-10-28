import { useState, useEffect } from 'react';
import { SpinWheel } from './components/SpinWheel';
import { SegmentManager } from './components/SegmentManager';
import { History } from './components/History';
import { Trophy} from 'lucide-react';

interface Topic {
  name: string;
  description: string;
}

const defaultSegments: Topic[] = [
  { name: '1', description: 'Q: What was RealPage’s first major product? A: OneSite – a property management system.' },
  { name: '2', description: 'Q: What is the full form of RPCC? A: RealPage Contact Center.' },
  { name: '3', description: 'Q: When did the Inception of RealPage Hyderabad happen? A: 2007.' },
  { name: '4', description: 'Q: What is Our (RealPage) Purpose? A: Inspire Amazing Experiences, Delivering Exceptional Value.' },
  { name: '5', description: 'Q: Most widely used product in RealPage? A: OneSite.' },
  { name: '6', description: 'Q: What is the name of RealPage’s AI engine? A: Lumina.' },
  { name: '7', description: 'Q: What is the name of RealPage’s revenue management tool? A: YieldStar.' },
  { name: '8', description: 'Q: What is the name of RealPage’s payment platform? A: ClickPay.' },
  { name: '9', description: 'Q: Name any 3 India R&R Award categories. A: Kudos, High-five, Cheers (also Applause, Ovation).' },
  { name: '10', description: 'Q: Name any 2 RealPage Business Priorities for 2025. A: Examples - One RealPage; Customer‑Centered Success (also Sustainable Growth, Market Driven Innovation, Operational Excellence).' },
  { name: '11', description: 'Q: Name any 2 Market categories under “The Multi Family Rental Industry”. A: Examples - Conventional Housing; Affordable Housing (also Senior, Student, Military, Single‑Family, Vacation Rental).' },
  { name: '12', description: 'Q: ClickPay is a RealPage company, where did it start? A: New York.' },
  { name: '13', description: 'Q: What is the full form of HOA? A: Home Owner Association.' },
  { name: '14', description: 'Q: How many Triangles are there in the Heart of RealPage Logo? A: 14.' },
  { name: '15', description: 'Q: What does the Heart of RealPage logo represent? A: Inclusion and Diversity.' },
  { name: '16', description: 'Q: For GMC (Group Medical Coverage), who is our insurer? A: National Insurance Co. Ltd.' },
  { name: '17', description: 'Q: Which year did RealPage go public? A: 2010.' },
  { name: '18', description: 'Q: Which Stock Market did RealPage go public on? A: NASDAQ.' },
  { name: '19', description: 'Q: Which are the LUMINA AI Workforce Agents? A: Leasing, Resident, Operations, Facilities, Finance Agents.' },
  { name: '20', description: 'Q: Name any 2 GMs and their BU name. A: Example - Hari Subramanian – Property & Renter Management (others: Rob Franklin, Amy Dreyfus, Kamal Qatato, Michael Mauseth, Dennis Kyle).' },
  { name: '21', description: 'Q: Can you name a few development resources at RealPage? A: Lead To Exceed, Learn To Lead, Learning Webinars, My Pathway, RPU.' },
  { name: '22', description: 'Q: What is the full form of UAT? A: User Acceptance Test.' },
  { name: '23', description: 'Q: What do the three orange dots in our company logo symbolize? A: Therefore.' },
  { name: '24', description: 'Q: How many weeks of maternity leave are provided to women employees? A: 26 weeks (182 days).' },
  { name: '25', description: 'Q: What is the 2025 motto/theme from the Leadership Kickoff Meeting (LKO)? A: Level Up.' },
  { name: '26', description: 'Q: What is the full form of PME? A: Problem Management Escalation.' },
  { name: '27', description: 'Q: What is the full form of MWM? A: Measure What Matters.' },
  { name: '28', description: 'Q: What is the name of Product’s Support Internal Wikipedia? A: RealPedia.' },
  { name: '29', description: 'Q: How many HOA units do we have? A: 10 million.' },
  { name: '30', description: 'Q: Which are the 3 categories in EMPLOYEE VOICE NPS Scoring Scale (1-10)? A: Detractors, Passive, Promoters.' },
];

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
  // Load custom topics from localStorage
  const [customTopics, setCustomTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('customTopics');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist names of topics permanently removed via the UI (clicking X)
  const [removedTopics, setRemovedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('removedTopics');
    return saved ? JSON.parse(saved) : [];
  });

  const [segments, setSegments] = useState<Topic[]>(() => {
    const saved = localStorage.getItem('wheelSegments');
    // Validate loaded segments are objects with name/description
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.every((s: any) => typeof s.name === 'string')) {
          return arr;
        }
      } catch {}
    }
    // On first load, use default + custom topics, but exclude permanently removed topics
    const customSaved = localStorage.getItem('customTopics');
    const customArr = customSaved ? JSON.parse(customSaved) : [];
    const removedSaved = localStorage.getItem('removedTopics');
    const removedArr = removedSaved ? JSON.parse(removedSaved) : [];
    return [...defaultSegments, ...customArr].filter((s) => !removedArr.includes(s.name));
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

  // Save custom topics to localStorage when changed
  useEffect(() => {
    localStorage.setItem('customTopics', JSON.stringify(customTopics));
  }, [customTopics]);

  // Save removed topics to localStorage when changed
  useEffect(() => {
    localStorage.setItem('removedTopics', JSON.stringify(removedTopics));
  }, [removedTopics]);

  // // Restore all topics if removedTopics is not empty (one-time on mount)
  // useEffect(() => {
  //   if (removedTopics.length > 0) {
  //     setRemovedTopics([]);
  //     // Optionally, also reset segments to show all topics immediately:
  //     setSegments([...defaultSegments, ...customTopics]);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // Accepts Topic object only
  const handleAddSegment = (segment: Topic) => {
    const name = segment.name.trim();
    if (
      name &&
      !segments.some(s => s.name.trim().toLowerCase() === name.toLowerCase())
    ) {
      setSegments([...segments, { name, description: segment.description || '' }]);
      // Add to custom topics if not already present
      if (!customTopics.some(s => s.name.trim().toLowerCase() === name.toLowerCase())) {
        setCustomTopics([...customTopics, { name, description: segment.description || '' }]);
      }
      // If this name was previously permanently removed, undo that removal (user explicitly re-added)
      if (removedTopics.some(n => n.toLowerCase() === name.toLowerCase())) {
        setRemovedTopics(removedTopics.filter(n => n.toLowerCase() !== name.toLowerCase()));
      }
    }
  };

  const handleRemoveSegment = (index: number) => {
    const seg = segments[index];
    if (!seg) return;
    // Remove from current segments
    setSegments(segments.filter((_, i) => i !== index));

    // If the removed item was added via UI (custom) remove it from customTopics
    setCustomTopics(customTopics.filter(s => s.name !== seg.name));

    // Mark this topic name as permanently removed so reset won't re-add it
    if (!removedTopics.includes(seg.name)) {
      setRemovedTopics([...removedTopics, seg.name]);
    }
  };

  const handleClearAll = () => {
    // Reset to default + custom topics but exclude permanently removed topics
    setSegments([...defaultSegments, ...customTopics].filter(s => !removedTopics.includes(s.name)));
    setHistory([]);
  };

  const handleSpinComplete = (result: string) => {
    // Find the topic object by name
    const winner = segments.find(s => s.name === result);
    if (winner) {
      setHistory([winner, ...history.slice(0, 4)]);
      // Remove the winner from the segments (transient removal — DO NOT add to removedTopics)
      setSegments(segments.filter(s => s.name !== result));
    }
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
