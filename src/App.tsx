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
  { name: '1', description: 'In which year was RealPage founded?' },
  { name: '2', description: 'What company did RealPage acquire at its founding?' },
  { name: '3', description: 'Where is RealPage headquartered?' },
  { name: '4', description: 'What was RealPage’s first major product?' },
  { name: '5', description: 'When did RealPage release the OneSite SaaS Platform?' },
  { name: '6', description: 'When did the Inception of RealPage Hyderabad happen?' },
  { name: '7', description: 'When did RealPage get acquired by Thoma Bravo?' },
  { name: '8', description: 'Name 2 countries that RealPage Operates from apart from US, India and Philippines.' },
  { name: '9', description: 'What is the Our (RealPage) Purpose?' },
  { name: '10', description: 'In which platform can you find RealPage Recognitions' },
  { name: '11', description: 'Which is the Employee Resource Group for Women employees in RealPage?' },
  { name: '12', description: 'Most widely used product in RealPage' },
  { name: '13', description: 'Who is the Chief Financial Officer for RealPage?' },
  { name: '14', description: 'Who is the Chief Operating Officer' },
  { name: '15', description: 'What is the name of RealPage’s AI engine?' },
  { name: '16', description: 'What is the name of RealPage’s payment platform?' },
  { name: '17', description: 'What is the name of the RealPage platform that integrates leasing, moving, and payments?' },
  { name: '18', description: 'Name the Core Values of RealPage' },
  { name: '19', description: 'Name any 3 India R&R Award categories.' },
  { name: '20', description: 'Name any 2 RealPage - Business Priorities for 2025.' },
  { name: '21', description: 'Name any 2 Market category that falls under ‘The Multi Family Rental Industry’' },
  { name: '22', description: 'What is the full form of PME?' },
  { name: '23', description: 'ClickPay is a RealPage company, where did it start?' },
  { name: '24', description: 'How many Triangles are there in the Heart of RealPage Logo?' },
  { name: '25', description: 'What does Heart of Realpage logo represent.' },
  { name: '26', description: 'Who is our EAP partner' },
  { name: '27', description: 'For GMC- Group Medical Coverage, who is our insurer' },
  { name: '28', description: 'Who is our Payroll Processing Partner' },
  { name: '29', description: 'Which is the quarterly recognition program highlighting outstanding performance and achievements by our teammates across the organization.' },
  { name: '30', description: 'The initiative RealTalk is done with whom?' },
  { name: '31', description: 'Name any 3 RealPage Business Units' },
  { name: '32', description: 'Which year did RealPage go public?' },
  { name: '33', description: 'Which Stock Market index did RealPage go public on?' },
  { name: '34', description: 'What is PDP?' },
  { name: '35', description: 'What is the 2025 motto/theme from the Leadership Kickoff Meeting (LKO)?' },
  { name: '36', description: 'Which are the LUMINA AI Workforce Agents' },
  { name: '37', description: 'Who is the TPA for our Insurance.' },
  { name: '38', description: 'Maximum how many Earned Leaves will be credited to your account in a year.' },
  { name: '39', description: 'How many weeks of maternity leave are provided to women employees' },
  { name: '40', description: 'What is the full form of REWS' },
  { name: '41', description: 'Which application is used to submit reimbursement bills?' },
  { name: '42', description: 'What is the name of our CSR (Corporate Social Responsibility) group in India under RealPage Cares?' },
  { name: '43', description: 'Name any 2 GMs and their BU name' },
  { name: '44', description: 'Can you name a few development resources that we have at Real Page?' },
  { name: '45', description: 'What do the three orange dots in our company logo symbolize?' },
  { name: '46', description: 'What is the full form of RIOT?' },
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
          left: fullscreen ? 32 : -160,
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
          height: fullscreen ? '165px' : '140px',
          width: fullscreen ? '190px' : '160px',
          position: fullscreen ? 'fixed' : 'absolute',
          right: fullscreen ? 32 : undefined,
          left: fullscreen ? undefined : 1500,
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
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-realpage-orange rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="relative py-6 px-4 border-b-4 border-realpage-orange bg-gradient-to-r from-realpage-blue via-realpage-blue to-realpage-blue/95 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-realpage-orange/10 to-transparent animate-pulse"></div>
          <div className="container mx-auto relative">
            {/* RealPage image at the left corner */}
            <Logos />

            <div className="flex items-center justify-center gap-4 mb-3">
              {/* <img ... /> removed from here */}
              <div className="animate-float">
                <Trophy className="w-10 h-10 text-realpage-orange drop-shadow-lg" />
              </div>
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-white via-realpage-orange to-white bg-clip-text text-transparent drop-shadow-2xl">
                    Do You REAL-LY Know?
                  </span>
                </h1>
              </div>
              {/* <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-10 h-10 text-realpage-orange drop-shadow-lg" />
              </div> */}
            </div>

            <div className="text-center space-y-1">
              <p className="text-2xl font-semibold text-white/95">Career Elevate</p>
              {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="w-2 h-2 rounded-full bg-realpage-orange animate-pulse"></div>
                <p className="text-sm font-medium text-white/90 tracking-wider">
                  Do You <span className="text-realpage-orange font-bold">REAL</span>-ly Know?
                </p>
              </div> */}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
            <div className="lg:col-span-2 flex justify-center">
              <SpinWheel
                segments={segments}
                onSpinComplete={handleSpinComplete}
                LogosComponent={(props: any) => <Logos {...props} fullscreen />}
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
