import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw } from 'lucide-react';

export function SimulatorCard() {
  const [force, setForce] = useState(10);
  const [time, setTime] = useState(2);
  const [mass, setMass] = useState(5);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const deltaP = force * time;
  const deltaV = deltaP / mass;

  const handleSimulate = () => {
    setKey(k => k + 1);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, time * 1000 + 500); // Wait for simulation to finish
      return () => clearTimeout(timer);
    }
  }, [isPlaying, time]);

  return (
    <div className="w-80 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg flex flex-col">
      <div className="bg-slate-800 text-white p-3 text-sm font-medium flex items-center justify-between">
        <span>冲量-动量变化模拟器</span>
        <div className="flex gap-1">
          <button className="w-2 h-2 rounded-full bg-red-400"></button>
          <button className="w-2 h-2 rounded-full bg-yellow-400"></button>
          <button className="w-2 h-2 rounded-full bg-green-400"></button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 w-12">力 (F)</label>
            <input 
              type="range" min="1" max="50" value={force} 
              onChange={e => setForce(Number(e.target.value))}
              className="flex-1 accent-indigo-500" 
              disabled={isPlaying}
            />
            <span className="text-xs font-mono w-10 text-right">{force} N</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 w-12">时间 (t)</label>
            <input 
              type="range" min="0.5" max="5" step="0.5" value={time} 
              onChange={e => setTime(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
              disabled={isPlaying}
            />
            <span className="text-xs font-mono w-10 text-right">{time} s</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-500 w-12">质量 (m)</label>
            <input 
              type="range" min="1" max="20" value={mass} 
              onChange={e => setMass(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
              disabled={isPlaying}
            />
            <span className="text-xs font-mono w-10 text-right">{mass} kg</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-4 border border-slate-100">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">冲量 (I = Ft)</div>
            <div className="text-lg font-mono font-medium text-slate-800">{deltaP.toFixed(1)} <span className="text-xs text-slate-500">N·s</span></div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">速度变化 (Δv)</div>
            <div className="text-lg font-mono font-medium text-indigo-600">{deltaV.toFixed(1)} <span className="text-xs text-slate-500">m/s</span></div>
          </div>
        </div>

        {/* Animation Area */}
        <div className="h-24 bg-slate-100 rounded-xl relative overflow-hidden flex flex-col justify-end pb-2 px-2 border border-slate-200">
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-300"></div>
          
          <motion.div 
            key={key}
            initial={{ x: 0 }}
            animate={{ x: isPlaying ? 200 : 0 }}
            transition={{ 
              duration: time, 
              ease: "linear"
            }}
            className="w-10 h-10 bg-indigo-500 rounded-md shadow-md flex items-center justify-center text-white text-xs font-bold relative z-10"
          >
            {mass}kg
            {isPlaying && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -left-6 top-1/2 -translate-y-1/2 text-orange-500 whitespace-nowrap font-mono text-[10px]"
              >
                ► F={force}N
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleSimulate}
            disabled={isPlaying}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            {isPlaying ? '演示中...' : '开始演示'}
          </button>
          <button 
            onClick={() => {setKey(k=>k+1); setIsPlaying(false);}}
            className="w-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
