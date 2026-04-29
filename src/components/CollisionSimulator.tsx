import { motion, useAnimation } from 'motion/react';
import { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export function CollisionSimulator({ isElastic = false }: { isElastic?: boolean }) {
  const [m1, setM1] = useState(2);
  const [v1, setV1] = useState(5);
  const [m2, setM2] = useState(3);
  const [v2, setV2] = useState(-2);
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const handlePlay = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    // 初始位置：相对于碰撞中心
    const distance1 = 150;
    const distance2 = 150;
    
    // 碰撞时间计算
    
    const startX1 = -180;
    const startX2 = 180;
    
    // 安全检查
    if (v1 <= v2) {
      alert("方块无法相撞 (v1 <= v2)");
      setIsPlaying(false);
      return;
    }

    // Time to collision
    const t_c = (startX2 - startX1) / (v1 - v2);
    // Collision position
    const colX = startX1 + v1 * t_c;

    // 阶段一：移向碰撞点
    await Promise.all([
      controls1.start({ x: colX, transition: { duration: t_c * 0.2, ease: "linear" } }),
      controls2.start({ x: colX, transition: { duration: t_c * 0.2, ease: "linear" } })
    ]);

    if (isElastic) {
      // 弹性碰撞碰后速度
      const v1_final = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
      const v2_final = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

      const endX1 = colX + v1_final * 10;
      const endX2 = colX + v2_final * 10;

      await Promise.all([
        controls1.start({ x: endX1, transition: { duration: 2, ease: "linear" } }),
        controls2.start({ x: endX2, transition: { duration: 2, ease: "linear" } })
      ]);
    } else {
      // 完全非弹性碰撞碰后速度
      const v_final = (m1 * v1 + m2 * v2) / (m1 + m2);

      const endX = colX + v_final * 10; 
      
      await Promise.all([
        controls1.start({ x: endX, transition: { duration: 2, ease: "linear" } }),
        controls2.start({ x: endX, transition: { duration: 2, ease: "linear" } })
      ]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    controls1.stop();
    controls2.stop();
    controls1.set({ x: -180 });
    controls2.set({ x: 180 });
  };

  return (
    <div className="w-[420px] bg-surface-container rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/50 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 text-sm tracking-tight">
          互动：{isElastic ? '完全弹性碰撞模拟' : '完全非弹性碰撞模拟'}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={handleReset}
            className="p-2 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
             <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={handlePlay}
            disabled={isPlaying}
            className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-full hover:bg-primary-700 transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-50 disabled:shadow-none flex items-center gap-1.5 active:scale-[0.98]"
          >
             <Play className="w-3 h-3 fill-current" /> 播放
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Track Area */}
        <div className="relative h-28 bg-white rounded-3xl border border-slate-200 shadow-inner flex items-center justify-center overflow-hidden">
          {/* Center Mark */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-error/20 left-1/2 -translate-x-1/2"></div>
          
          <motion.div 
            animate={controls1}
            initial={{ x: -180 }}
            className="absolute z-10 w-12 h-12 bg-primary-500 rounded-2xl border-2 border-primary-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_4px_10px_rgba(79,70,229,0.3)]"
          >
            <div className="absolute -top-6 left-1/2 flex items-center h-4 w-24">
              {v1 !== 0 && (
                <div 
                  className={`h-0.5 bg-primary-500 absolute top-1/2 -translate-y-1/2 ${v1 > 0 ? 'left-0 origin-left' : 'right-0 origin-right'} transition-all`}
                  style={{ width: `${Math.abs(v1) * 3}px` }}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent ${v1 > 0 ? 'border-l-[6px] border-l-primary-500 -right-[4px]' : 'border-r-[6px] border-r-primary-500 -left-[4px]'}`} />
                </div>
              )}
            </div>
            A
          </motion.div>
          <motion.div 
            animate={controls2}
            initial={{ x: 180 }}
            className="absolute z-10 w-14 h-14 bg-amber-500 rounded-2xl border-2 border-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-[0_4px_10px_rgba(245,158,11,0.3)]"
          >
            <div className="absolute -top-6 left-1/2 flex items-center h-4 w-24">
              {v2 !== 0 && (
                <div 
                  className={`h-0.5 bg-amber-500 absolute top-1/2 -translate-y-1/2 ${v2 > 0 ? 'left-0 origin-left' : 'right-0 origin-right'} transition-all`}
                  style={{ width: `${Math.abs(v2) * 3}px` }}
                >
                  <div className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent ${v2 > 0 ? 'border-l-[6px] border-l-amber-500 -right-[4px]' : 'border-r-[6px] border-r-amber-500 -left-[4px]'}`} />
                </div>
              )}
            </div>
            B
          </motion.div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4 bg-primary-50/50 p-4 rounded-[24px] border border-primary-100">
            <h4 className="text-xs font-bold text-primary-800 uppercase tracking-wider flex justify-between">
              <span>木块 A</span>
              <span className="font-mono bg-primary-200/50 px-1.5 rounded-md text-[10px]">m={m1} v={v1}</span>
            </h4>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 flex justify-between uppercase tracking-wider">质量 (kg) <span>{m1} kg</span></label>
              <input type="range" min="1" max="10" value={m1} disabled={isPlaying} onChange={e => setM1(Number(e.target.value))} className="w-full accent-primary-600 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 flex justify-between uppercase tracking-wider">初速 (m/s) <span>{v1} m/s</span></label>
              <input type="range" min="1" max="10" value={v1} disabled={isPlaying} onChange={e => setV1(Number(e.target.value))} className="w-full accent-primary-600 focus:outline-none" />
            </div>
          </div>

          <div className="space-y-4 bg-amber-50/50 p-4 rounded-[24px] border border-amber-100/50">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex justify-between">
              <span>木块 B</span>
              <span className="font-mono bg-amber-200/50 px-1.5 rounded-md text-[10px]">m={m2} v={v2}</span>
            </h4>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 flex justify-between uppercase tracking-wider">质量 (kg) <span>{m2} kg</span></label>
              <input type="range" min="1" max="10" value={m2} disabled={isPlaying} onChange={e => setM2(Number(e.target.value))} className="w-full accent-amber-500 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 flex justify-between uppercase tracking-wider">初速 (m/s) <span>{v2} m/s</span></label>
              <input type="range" min="-10" max="0" value={v2} disabled={isPlaying} onChange={e => setV2(Number(e.target.value))} className="w-full accent-amber-500 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Live Calculation */}
        <div className="bg-slate-800 p-4 rounded-[24px] text-xs text-slate-300 font-mono flex flex-col gap-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-xl">
            <span>总动量 <span className="text-slate-500 text-[10px]">P_total</span></span>
            <span className="text-emerald-400 font-bold">{(m1*v1 + m2*v2).toFixed(1)} <span className="opacity-70 text-[10px]">kg·m/s</span></span>
          </div>
          <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-xl">
            {isElastic ? (
              <>
                <span>碰后分离速度 <span className="text-slate-500 text-[10px]">v1', v2'</span></span>
                <span className="text-blue-400 font-bold">
                  {(((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)).toFixed(2)}, {(((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)).toFixed(2)}
                  <span className="opacity-70 text-[10px]"> m/s</span>
                </span>
              </>
            ) : (
              <>
                <span>碰后共速 <span className="text-slate-500 text-[10px]">v'</span></span>
                <span className="text-amber-400 font-bold">
                  {((m1*v1 + m2*v2)/(m1+m2)).toFixed(2)} <span className="opacity-70 text-[10px]">m/s</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
