import { Clock, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Topic {
  name: string;
  description: string;
}

interface HistoryProps {
  history: Topic[];
}

export function History({ history }: HistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-realpage-blue/40 via-realpage-blue/60 to-realpage-blue/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-realpage-orange/30">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-realpage-orange/20 rounded-lg">
            <Clock className="w-5 h-5 text-realpage-orange" />
          </div>
          <h2 className="text-2xl font-bold text-white">Recent Winners</h2>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {history.map((item, index) => (
              <motion.div
                key={`${item.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <div className="relative bg-white/5 backdrop-blur-sm px-4 py-4 rounded-xl border-2 border-white/10 hover:border-realpage-orange/50 transition-all hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {index === 0 && (
                        <Trophy className="w-5 h-5 text-realpage-orange animate-pulse" />
                      )}
                      <span className="text-white font-semibold text-lg">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white/50 px-2 py-1 bg-white/5 rounded-lg">
                        #{history.length - index}
                      </span>
                    </div>
                  </div>
                  {/* Show description if present */}
                  {item.description && (
                    <div className="mt-2 text-white/60 text-sm italic">{item.description}</div>
                  )}
                  {index === 0 && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-realpage-orange/10 to-transparent opacity-50"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 pt-4 border-t-2 border-white/20">
          <p className="text-sm text-white/60 text-center">
            Showing last {history.length} {history.length === 1 ? 'spin' : 'spins'}
          </p>
        </div>
      </div>
    </div>
  );
}
