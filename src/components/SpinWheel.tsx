import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, X } from 'lucide-react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Topic {
  name: string;
  description: string;
  answers?: string;
}

interface SpinWheelProps {
  segments: Topic[];
  onSpinComplete: (result: string) => void;
  LogosComponent?: React.ComponentType;
}

const COLORS = [
  '#001a4aff',
  '#e56205ff',
  '#FFFFFF',
];

export function SpinWheel({ segments, onSpinComplete, LogosComponent }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<Topic | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = segments.length > 0 ? 360 / segments.length : 0;

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const handleSpin = () => {
    if (isSpinning || segments.length === 0) return;

    setIsSpinning(true);
    setSelectedSegment(null);
    setShowAnswer(false); // Reset answer visibility

    // Generate a random spin amount and angle
    const randomSpins = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + randomSpins * 360 + randomAngle;

    setRotation(totalRotation);

    // Calculate which segment lands at the triangle (top, angle 0)
    setTimeout(() => {
      const normalizedAngle = (totalRotation % 360 + 360) % 360;
      let segmentIndex = Math.floor(((360 - normalizedAngle) % 360) / segmentAngle);
      if (segmentIndex < 0) segmentIndex += segments.length;
      const result = segments[segmentIndex];

      setIsSpinning(false);
      setSelectedSegment(result);
      onSpinComplete(result.name);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00205B', '#FF6B00', '#FFFFFF'],
        scalar: 1.2,
      });

      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.6 },
          colors: ['#00205B', '#FF6B00', '#FFFFFF'],
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.6 },
          colors: ['#00205B', '#FF6B00', '#FFFFFF'],
        });
      }, 250);
    }, 5000);
  };

  const handleFullscreen = () => {
    if (!wheelRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wheelRef.current.requestFullscreen();
    }
  };

  const isColorLight = (hex: string) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 180;
  };

  const getTextColorForIndex = (index: number) =>
    isColorLight(COLORS[index % COLORS.length]) ? '#00205B' : '#FFFFFF';

  // Dynamically set wheel size and font size for fullscreen
  const wheelSize = isFullscreen ? 900 : 600; // px
  const wheelRadius = wheelSize / 2 - 10; // leave some padding
  const center = wheelSize / 2;
  // Font size: shrink as segments grow, but keep readable
  const topicFontSize = Math.max(18, 38 - Math.floor(segments.length * 0.7));

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div
        ref={wheelRef}
        className={`relative flex items-center justify-center ${isFullscreen ? 'fixed inset-0 z-[100] bg-gradient-to-br from-black via-realpage-blue/20 to-black' : ''}`}
        style={isFullscreen ? { minHeight: '100vh' } : {}}
      >
        {isFullscreen && LogosComponent && (
          <div className="pointer-events-none select-none">
            <LogosComponent fullscreen />
          </div>
        )}

        {!isFullscreen && (
          <button
            onClick={handleFullscreen}
            className="absolute top-4 right-4 z-50 p-3 rounded-xl bg-realpage-orange/90 hover:bg-realpage-orange border-2 border-white/50 shadow-xl transition-all hover:scale-110 active:scale-95 glow-orange"
            title="Fullscreen"
            type="button"
          >
            <Maximize2 className="w-6 h-6 text-white" />
          </button>
        )}
        {isFullscreen && (
          <button
            onClick={handleFullscreen}
            className="absolute top-4 right-4 z-[150] p-3 rounded-xl bg-realpage-orange/90 hover:bg-realpage-orange border-2 border-white/50 shadow-xl transition-all hover:scale-110 active:scale-95 glow-orange"
            title="Exit Fullscreen"
            type="button"
          >
            <Minimize2 className="w-6 h-6 text-white" />
          </button>
        )}

        <div
          className={`relative rounded-full bg-white/5 backdrop-blur-sm border-4 border-realpage-orange/50 shadow-2xl flex items-center justify-center glow-orange transition-all duration-300 ${isSpinning ? 'scale-105' : 'scale-100'}`}
          style={{
            width: wheelSize,
            height: wheelSize,
            margin: isFullscreen ? 'auto' : undefined,
          }}
        >
          <motion.div
            className="absolute z-50"
            animate={isSpinning ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
            style={{
              left: '50%',
              top: `calc(50% - ${wheelRadius}px)`,
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: `${Math.round(wheelSize * 0.03)}px solid transparent`,
                borderRight: `${Math.round(wheelSize * 0.03)}px solid transparent`,
                borderBottom: `${Math.round(wheelSize * 0.045)}px solid #FF6B00`,
                filter: 'drop-shadow(0 4px 12px rgba(255, 107, 0, 0.8))',
              }}
            ></div>
          </motion.div>

          <div
            className="absolute z-50"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.button
              onClick={handleSpin}
              disabled={isSpinning || segments.length === 0}
              className={`
                group relative rounded-full font-black text-lg
                bg-gradient-to-br from-realpage-orange via-realpage-orange to-realpage-orange/80
                hover:from-realpage-orange hover:via-realpage-orange/90 hover:to-realpage-orange
                disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                transition-all duration-300
                shadow-2xl shadow-realpage-orange/60
                disabled:shadow-none
                border-4 border-white/30
                ${isSpinning ? 'animate-pulse-glow' : 'hover:scale-110 active:scale-95'}
              `}
              style={{
                width: Math.round(wheelSize * 0.18),
                height: Math.round(wheelSize * 0.18),
                fontSize: Math.max(18, Math.round(wheelSize * 0.025)),
              }}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex flex-col items-center justify-center gap-1">
                {isSpinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Play style={{ width: Math.round(wheelSize * 0.045), height: Math.round(wheelSize * 0.045) }} />
                    </motion.div>
                    <span className="text-xs font-bold">Spinning</span>
                  </>
                ) : (
                  <>
                    <Play style={{ width: Math.round(wheelSize * 0.045), height: Math.round(wheelSize * 0.045) }} />
                    <span className="text-sm font-extrabold">SPIN</span>
                  </>
                )}
              </span>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-realpage-orange to-white opacity-0 group-hover:opacity-40 blur-2xl transition-opacity -z-10"></div>
            </motion.button>
          </div>

          {/* Wheel SVG - segments and topics spin together */}
          <div className="relative">
            <svg
              width={wheelSize}
              height={wheelSize}
              viewBox={`0 0 ${wheelSize} ${wheelSize}`}
              className="drop-shadow-2xl"
            >
              <defs>
                {/* Remove segment gradients, keep only shadow and center gradients */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                  <feOffset dx="0" dy="4" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <circle
                cx={center}
                cy={center}
                r={wheelRadius}
                fill="url(#wheel-gradient)"
                stroke="#FF6B00"
                strokeWidth={Math.max(6, wheelSize * 0.008)}
                filter="url(#shadow)"
              />
              <defs>
                <radialGradient id="wheel-gradient">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#00205B" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              {/* Segments and topics spin together */}
              <motion.g
                animate={{ rotate: rotation }}
                transition={{
                  duration: 5,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                style={{ transformOrigin: `${center}px ${center}px` }}
              >
                {/* Only render segments if there are any */}
                {segments.length > 0 && segments.map((segment, index) => {
                  const segmentAngle = 360 / segments.length;
                  const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
                  const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
                  const largeArcFlag = segmentAngle > 180 ? 1 : 0;
                  const x1 = center + wheelRadius * Math.cos(startAngle);
                  const y1 = center + wheelRadius * Math.sin(startAngle);
                  const x2 = center + wheelRadius * Math.cos(endAngle);
                  const y2 = center + wheelRadius * Math.sin(endAngle);

                  const midAngle = (startAngle + endAngle) / 2;
                  const textX = center + (wheelRadius * 0.65) * Math.cos(midAngle);
                  const textY = center + (wheelRadius * 0.65) * Math.sin(midAngle);
                  const textRotation = (midAngle * 180) / Math.PI + 90;

                  return (
                    <g key={index}>
                      <path
                        d={`M ${center} ${center} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={COLORS[index % COLORS.length]} // Use solid color
                        stroke="#00205B"
                        strokeWidth={Math.max(3, wheelSize * 0.004)}
                        className="transition-opacity hover:opacity-90"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill={getTextColorForIndex(index)}
                        fontSize={topicFontSize}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                        className="pointer-events-none select-none drop-shadow-lg"
                        style={{
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          fontSize: topicFontSize,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {segment.name}
                      </text>
                    </g>
                  );
                })}
              </motion.g>
              <circle
                cx={center}
                cy={center}
                r={Math.max(80, wheelSize * 0.13)}
                fill="url(#center-gradient)"
                stroke="#FF6B00"
                strokeWidth={Math.max(6, wheelSize * 0.008)}
              />
              <defs>
                <linearGradient id="center-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00205B', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#FF6B00', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Winner overlay always visible in fullscreen - move inside wheelRef container */}
        {isFullscreen && (
          <AnimatePresence>
            {selectedSegment && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
                style={{ pointerEvents: 'auto' }} // ensure clickable
                onClick={() => { setSelectedSegment(null); setShowAnswer(false); }}
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: 50 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
                  className="relative bg-gradient-to-br from-realpage-blue via-realpage-blue to-realpage-blue/95 backdrop-blur-xl px-12 md:px-16 py-12 md:py-14 rounded-3xl border-8 border-realpage-orange shadow-2xl max-w-3xl w-[95%] md:w-[90%] glow-orange"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-realpage-orange/20 rounded-3xl"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.1),transparent_50%)] rounded-3xl"></div>
                  <button
                    onClick={() => setSelectedSegment(null)}
                    className="absolute -top-6 -right-6 p-4 rounded-full bg-gradient-to-br from-realpage-orange to-realpage-orange/80 text-white hover:from-realpage-orange hover:to-realpage-orange shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 border-white z-10 glow-orange"
                    aria-label="Close"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <div className="relative text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                    >
                      <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/5 rounded-full border border-realpage-orange/30">
                        <div className="w-3 h-3 rounded-full bg-realpage-orange animate-pulse shadow-lg shadow-realpage-orange/50"></div>
                        <p className="text-xl md:text-2xl font-bold text-white/95 uppercase tracking-widest">
                          Question Time
                        </p>
                        <div className="w-3 h-3 rounded-full bg-realpage-orange animate-pulse shadow-lg shadow-realpage-orange/50"></div>
                      </div>
                    </motion.div>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-5xl md:text-7xl font-black text-realpage-orange break-words leading-tight drop-shadow-2xl"
                      style={{ textShadow: '0 0 40px rgba(255, 107, 0, 0.6), 0 0 80px rgba(255, 107, 0, 0.3)' }}
                    >
                      {selectedSegment.name}
                    </motion.p>
                    {selectedSegment.description && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-lg md:text-xl text-white/90 mt-6 font-medium px-4"
                      >
                        {selectedSegment.description}
                      </motion.div>
                    )}
                    
                    {/* Show Answer section */}
                    {selectedSegment.answers && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-6"
                      >
                        {showAnswer ? (
                          <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6">
                            <p className="text-green-300 font-bold text-base uppercase mb-3 tracking-wider">Answer:</p>
                            <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">{selectedSegment.answers}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowAnswer(true)}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-2xl border-2 border-green-400/50"
                          >
                            Show Answer
                          </button>
                        )}
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.45, type: "spring" }}
                      className="pt-6 border-t-2 border-white/20"
                    >
                      <p className="text-base md:text-lg text-white/70 font-medium">
                        Time to showcase your knowledge!
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Hide everything except wheel, triangle, spin button, winner overlay in fullscreen */}
      {!isFullscreen && (
        <AnimatePresence>
          {selectedSegment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm"
              onClick={() => { setSelectedSegment(null); setShowAnswer(false); }}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0, y: 50 }}
                transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
                className="relative bg-gradient-to-br from-realpage-blue via-realpage-blue to-realpage-blue/95 backdrop-blur-xl px-12 md:px-16 py-12 md:py-14 rounded-3xl border-8 border-realpage-orange shadow-2xl max-w-3xl w-[95%] md:w-[90%] glow-orange"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-realpage-orange/20 rounded-3xl"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.1),transparent_50%)] rounded-3xl"></div>

                <button
                  onClick={() => setSelectedSegment(null)}
                  className="absolute -top-6 -right-6 p-4 rounded-full bg-gradient-to-br from-realpage-orange to-realpage-orange/80 text-white hover:from-realpage-orange hover:to-realpage-orange shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 border-white z-10 glow-orange"
                  aria-label="Close"
                >
                  <X className="w-8 h-8" />
                </button>

                <div className="relative text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                  >
                    <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-white/5 rounded-full border border-realpage-orange/30">
                      <div className="w-3 h-3 rounded-full bg-realpage-orange animate-pulse shadow-lg shadow-realpage-orange/50"></div>
                      <p className="text-xl md:text-2xl font-bold text-white/95 uppercase tracking-widest">
                        Question Time
                      </p>
                      <div className="w-3 h-3 rounded-full bg-realpage-orange animate-pulse shadow-lg shadow-realpage-orange/50"></div>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-7xl font-black text-realpage-orange break-words leading-tight drop-shadow-2xl"
                    style={{ textShadow: '0 0 40px rgba(255, 107, 0, 0.6), 0 0 80px rgba(255, 107, 0, 0.3)' }}
                  >
                    {selectedSegment.name}
                  </motion.p>

                  {selectedSegment.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="text-lg md:text-xl text-white/90 mt-6 font-medium px-4"
                    >
                      {selectedSegment.description}
                    </motion.div>
                  )}

                  {/* Show Answer section */}
                  {selectedSegment.answers && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6"
                    >
                      {showAnswer ? (
                        <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6">
                          <p className="text-green-300 font-bold text-base uppercase mb-3 tracking-wider">Answer:</p>
                          <p className="text-white text-lg md:text-xl font-semibold leading-relaxed">{selectedSegment.answers}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowAnswer(true)}
                          className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-2xl border-2 border-green-400/50"
                        >
                          Show Answer
                        </button>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.45, type: "spring" }}
                    className="pt-6 border-t-2 border-white/20"
                  >
                    <p className="text-base md:text-lg text-white/70 font-medium">
                      Time to showcase your knowledge!
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}