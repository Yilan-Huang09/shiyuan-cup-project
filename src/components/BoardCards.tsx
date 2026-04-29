import { motion } from 'motion/react';
import { BoardCard } from '../types';
import { cn } from '../lib/utils';
import { CheckCircle2, Bookmark, Lightbulb, AlertTriangle, ChevronRight, FileText, Pin, PinOff, ChevronDown, ChevronUp, GripHorizontal, Pencil, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SimulatorCard } from './SimulatorCard';
import { CollisionSimulator } from './CollisionSimulator';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface CardProps {
  card: BoardCard;
  isEditing?: boolean;
  onUpdate?: (updates: Partial<BoardCard>) => void;
}

export function KnowledgeCard({ card, isEditing, onUpdate }: CardProps) {
  if (isEditing && onUpdate) {
    return (
      <div className="w-72 bg-surface-container rounded-[32px] shadow-lg border border-primary-100 overflow-hidden" style={{ width: card.width || 288, height: card.height, resize: 'both', overflow: 'hidden' }}>
        <div className="bg-primary-50 px-5 py-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
          <input 
            value={card.title} 
            onChange={e => onUpdate({ title: e.target.value })}
            className="flex-1 bg-transparent border-b-2 border-primary-200 outline-none text-base font-semibold text-slate-800 focus:border-primary-500 transition-colors px-1"
          />
        </div>
        <div className="p-5 flex flex-col gap-4 h-[calc(100%-60px)] overflow-auto bg-surface-container">
          <textarea 
            value={card.content || ''} 
            onChange={e => onUpdate({ content: e.target.value })}
            className="w-full text-sm text-slate-700 bg-white border border-slate-200 rounded-2xl p-4 outline-none resize-none min-h-[100px] focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all shadow-sm"
            placeholder="知识点内容..."
          />
          {card.formula !== undefined && (
            <textarea 
               value={card.formula} 
               onChange={e => onUpdate({ formula: e.target.value })}
               className="w-full font-mono text-sm text-indigo-800 bg-indigo-50 border border-indigo-100 rounded-2xl p-4 outline-none resize-none min-h-[80px] focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
               placeholder="LaTeX 公式..."
            />
          )}
          {card.pitfall !== undefined && (
            <textarea 
               value={card.pitfall} 
               onChange={e => onUpdate({ pitfall: e.target.value })}
               className="w-full text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-2xl p-4 outline-none resize-none min-h-[80px] focus:ring-2 focus:ring-amber-200 transition-all shadow-sm"
               placeholder="易错点..."
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-surface-container rounded-[32px] overflow-hidden relative group/card h-full" 
         style={{ width: card.width || 288, height: card.height, resize: 'both', overflow: 'auto' }}
         onMouseUp={(e) => {
           // Capture CSS resize
           if (onUpdate && (e.currentTarget.style.width || e.currentTarget.style.height)) {
             onUpdate({ width: parseInt(e.currentTarget.style.width), height: parseInt(e.currentTarget.style.height) });
           }
         }}>
      <div className="bg-primary-50/50 px-6 py-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-800 leading-tight tracking-tight">{card.title}</h3>
          {card.tags && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {card.tags.map(tag => (
                <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-slate-200/60 text-slate-500 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {card.content && (
          <div className="text-[15px] text-slate-700 leading-relaxed font-medium [&_p]:my-2">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {card.content}
            </ReactMarkdown>
          </div>
        )}
        
        {card.formula && (
          <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center justify-center py-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
            <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-2">公式</span>
            <div className="font-mono text-xl font-bold text-slate-800 text-center">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {card.formula}
              </ReactMarkdown>
            </div>
          </div>
        )}
        
        {card.pitfall && (
          <div className="bg-error-container p-4 rounded-3xl">
            <div className="flex items-center gap-1.5 text-error mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">易错点</span>
            </div>
            <div className="text-[13px] text-on-error-container leading-relaxed [&_p]:my-0">
               <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {card.pitfall}
               </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {card.sourceId && (
        <div className="px-6 py-4 flex justify-between items-center text-xs mt-auto">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" /> 来源
          </span>
          <span className="text-primary-600 font-semibold bg-primary-50 px-2.5 py-1 rounded-full">{card.sourceId}</span>
        </div>
      )}
    </div>
  );
}

export function QuizCardGroup({ card }: CardProps) {
  const questions = card.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  if (questions.length === 0) return null;
  const currentQ = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowAnswer(false);
    }
  };

  return (
    <div className="w-[340px] bg-surface-container rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/50 overflow-hidden relative pb-2">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-[64px] -z-10 transition-all hover:scale-110"></div>
      
      <div className="px-6 py-5 border-b border-primary-50/50 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">{card.title}</h3>
        <span className="bg-primary-50 text-primary-700 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-[0_2px_10px_rgb(0,0,0,0.02)]">题 {currentIndex + 1}/{questions.length}</span>
      </div>

      <div className="p-6">
        <div className="text-[15px] text-slate-700 font-medium leading-relaxed mb-5 [&_p]:my-1">
           <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
             {currentQ.question}
           </ReactMarkdown>
        </div>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => { setSelected(i); setShowAnswer(false); }}
              className={cn(
                "w-full text-left px-5 py-3.5 rounded-[20px] text-sm font-medium transition-all group shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]",
                selected === i ? "shadow-[inset_0_0_0_2px_rgba(79,70,229,0.5)] bg-primary-50/50 text-primary-800 flex flex-col scale-[1.02]" : "hover:shadow-[inset_0_0_0_1px_rgba(79,70,229,0.3)] hover:bg-slate-50 text-slate-600 flex flex-col"
              )}
            >
              <div className="flex items-center">
                 <span className={cn(
                   "inline-block w-7 h-7 text-center leading-7 rounded-full mr-3.5 text-xs shrink-0 font-bold transition-colors",
                   selected === i ? "bg-primary-200 text-primary-900" : "bg-slate-100 text-slate-500 group-hover:bg-primary-100 group-hover:text-primary-700"
                 )}>
                   {String.fromCharCode(65 + i)}
                 </span>
                 <div className="leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {opt}
                    </ReactMarkdown>
                 </div>
              </div>
            </button>
          ))}
        </div>

        {selected !== null && !showAnswer && (
          <button 
            onClick={() => setShowAnswer(true)}
            className="w-full mt-5 bg-slate-800 hover:bg-slate-900 text-white rounded-full py-3.5 text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] active:scale-[0.98]"
          >
            提交答案
          </button>
        )}

        {showAnswer && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={cn(
              "mt-5 p-5 rounded-[24px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]",
              selected === currentQ.correctAnswer ? "bg-green-50/80 shadow-[inset_0_0_0_1px_rgba(34,197,94,0.2)]" : "bg-error-container/50 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.2)]"
            )}
          >
            <div className={cn(
               "flex items-center gap-2 font-bold mb-3 text-[15px]",
               selected === currentQ.correctAnswer ? "text-green-700" : "text-error"
            )}>
              <CheckCircle2 className="w-5 h-5" />
              {selected === currentQ.correctAnswer ? "回答正确" : "回答错误"}
            </div>
            <div className={cn(
               "text-[13px] leading-relaxed [&_p]:my-1.5",
               selected === currentQ.correctAnswer ? "text-green-800" : "text-on-error-container"
            )}>
              <strong className="block mb-1 opacity-80">解析：</strong> 
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQ.explanation}
              </ReactMarkdown>
            </div>
            
            {currentIndex < questions.length - 1 ? (
               <button 
                 onClick={handleNext}
                 className="mt-5 w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-bold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] active:scale-[0.98]"
               >
                 下一题
               </button>
            ) : (
               <div className="mt-5 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-white/50 py-2 rounded-full">
                 已完成所有题目
               </div>
            )}

            {selected !== currentQ.correctAnswer && (
              <button className="mt-4 text-[11px] font-bold text-slate-500 hover:text-primary-700 uppercase tracking-wider flex items-center gap-1.5 justify-center w-full transition-colors">
                <FileText className="w-3.5 h-3.5" />
                复习相关知识卡片
              </button>
            )}
          </motion.div>
        )}
      </div>
      
      {/* 装饰性层叠卡片 */}
      <div className="absolute left-4 right-4 -bottom-1 h-3 bg-slate-50/80 border border-slate-200/50 rounded-b-[24px] z-[-1] shadow-sm"></div>
      <div className="absolute left-8 right-8 -bottom-2 h-3 bg-slate-50/50 border border-slate-200/30 rounded-b-[20px] z-[-2]"></div>
    </div>
  );
}

export function SummaryCard({ card, isEditing, onUpdate }: CardProps) {
  if (isEditing && onUpdate) {
    return (
      <div className="w-[440px] bg-primary-600 text-white rounded-[36px] shadow-[0_20px_40px_rgba(79,70,229,0.2)] overflow-hidden p-8 relative" style={{ width: card.width || 440, height: card.height, resize: 'both', overflow: 'hidden' }}>
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-400/40 rounded-full blur-3xl mix-blend-screen"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-purple-400/30 rounded-full blur-3xl mix-blend-screen"></div>

        <div className="relative z-10 flex items-center justify-between mb-6">
          <input 
            value={card.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-xl font-bold tracking-tight bg-transparent border-b-2 border-primary-300 outline-none w-full mr-2 text-white placeholder-primary-300 focus:border-white transition-colors pb-1"
            placeholder="小结标题..."
          />
        </div>

        <div className="relative z-10 w-full h-[calc(100%-60px)]">
          <textarea
            value={card.content || ''}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full h-full bg-primary-800/40 p-5 rounded-[24px] border border-primary-400/30 outline-none resize-none text-[15px] leading-relaxed text-primary-50 font-medium whitespace-pre-wrap shadow-inner backdrop-blur-sm focus:border-white/50 transition-colors"
            placeholder="使用 - 列表开始每一项..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[440px] bg-primary-600 text-white rounded-[36px] shadow-[0_20px_40px_rgba(79,70,229,0.2)] overflow-hidden p-8 relative group/card"
         style={{ width: card.width || 440, height: card.height, resize: 'both', overflow: 'auto' }}
         onMouseUp={(e) => {
           if (onUpdate && (e.currentTarget.style.width || e.currentTarget.style.height)) {
             onUpdate({ width: parseInt(e.currentTarget.style.width), height: parseInt(e.currentTarget.style.height) });
           }
         }}>
      {/* Abstract background shapes */}
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-400/40 rounded-full blur-3xl mix-blend-screen transition-transform duration-1000 group-hover/card:scale-110"></div>
      <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-purple-400/30 rounded-full blur-3xl mix-blend-screen transition-transform duration-1000 group-hover/card:scale-110"></div>

      <div className="relative z-10 flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold tracking-tight">{card.title}</h3>
        <span className="text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
          Board 提炼
        </span>
      </div>

      <div className="relative z-10 space-y-4">
        {card.content?.split('\n').filter(Boolean).map((line, i) => (
          <div key={i} className="flex items-start gap-4 bg-primary-800/40 p-4 rounded-[20px] border border-primary-400/30 backdrop-blur-sm shadow-sm transition-transform hover:-translate-y-0.5">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-black shadow-inner border border-primary-400/50">
              {i + 1}
            </span>
            <div className="text-[15px] leading-relaxed text-primary-50 font-medium mt-0.5 [&_p]:my-1">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {line.replace(/^-\s*/, '')}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RenderBoardCard({ card, onUpdatePosition, onUpdateCard }: { card: BoardCard, onUpdatePosition?: (id: string, x: number, y: number) => void, onUpdateCard?: (id: string, updates: Partial<BoardCard>) => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPinned, setIsPinned] = useState(card.isPinned || false);
  const [isEditing, setIsEditing] = useState(false);
  const [pos, setPos] = useState({ x: card.x, y: card.y });

  useEffect(() => {
    setPos({ x: card.x, y: card.y });
  }, [card.x, card.y]);

  const handleDragEnd = (_e: any, info: any) => {
    // Snap to a grid of 40px
    const GRID = 40;
    const newX = Math.round((pos.x + info.offset.x) / GRID) * GRID;
    const newY = Math.round((pos.y + info.offset.y) / GRID) * GRID;
    setPos({ x: newX, y: newY });
    if (onUpdatePosition) {
      onUpdatePosition(card.id, newX, newY);
    }
  };

  const updateScale = (delta: number) => {
    if (onUpdateCard) {
      const currentScale = card.scale || 1;
      const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
      onUpdateCard(card.id, { scale: newScale });
    }
  };

  return (
    <motion.div
      drag={!isPinned}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: card.scale || 1, 
        x: pos.x, 
        y: pos.y 
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={cn(
        "absolute z-10",
        !isPinned && "cursor-grab active:cursor-grabbing hover:z-50"
      )}
      style={{ left: 0, top: 0 }}
    >
      <div className="relative group">
        {/* Floating Toolbar */}
        <div className={cn(
          "absolute -top-4 right-4 -translate-y-full flex items-center gap-1 p-1 bg-surface/90 backdrop-blur-md rounded-full shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-200/50 transition-all z-50",
          (isCollapsed || isPinned || isEditing) 
            ? "opacity-100 translate-y-[-100%]" 
            : "opacity-0 translate-y-[-80%] group-hover:opacity-100 group-hover:translate-y-[-100%]"
        )}>
          {!isPinned && (
            <div className="px-2 text-slate-300">
               <GripHorizontal className="w-4 h-4" />
            </div>
          )}
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onClick={() => updateScale(0.1)}
            className="p-2 rounded-full transition-colors text-slate-600 hover:bg-slate-100"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateScale(-0.1)}
            className="p-2 rounded-full transition-colors text-slate-600 hover:bg-slate-100"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          {card.type === 'knowledge' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={cn("p-2 rounded-full transition-all", isEditing ? "text-primary-700 bg-primary-50 shadow-inner" : "text-slate-600 hover:bg-slate-100")}
              title={isEditing ? "保存" : "编辑内容"}
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => {
              setIsPinned(!isPinned);
              if (onUpdateCard) onUpdateCard(card.id, { isPinned: !isPinned });
            }}
            className={cn("p-2 rounded-full transition-all", isPinned ? "text-indigo-600 bg-indigo-50 shadow-inner" : "text-slate-600 hover:bg-slate-100")}
            title={isPinned ? "取消固定" : "固定位置"}
          >
            {isPinned ? <Pin className="w-4 h-4" fill="currentColor" /> : <PinOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full transition-colors text-slate-600 hover:bg-slate-100"
            title={isCollapsed ? "展开" : "收起"}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Card Body */}
        {isCollapsed ? (
          <div className="w-64 bg-surface-container backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/50 rounded-[28px] px-5 py-4 flex items-center justify-between pointer-events-auto transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0" />
               <h3 className="text-sm font-semibold text-slate-800 truncate tracking-tight">{card.title}</h3>
            </div>
          </div>
        ) : (
          <div className={cn(
            "pointer-events-auto rounded-[32px] transition-shadow",
            isPinned ? "shadow-[0_2px_10px_rgb(0,0,0,0.02)]" : "shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
          )}>
            {card.type === 'knowledge' && <KnowledgeCard card={card} isEditing={isEditing} onUpdate={(updates) => onUpdateCard && onUpdateCard(card.id, updates)} />}
            {card.type === 'simulator' && card.simulatorType === 'collision' && <CollisionSimulator isElastic={card.isElastic} />}
            {card.type === 'simulator' && card.simulatorType !== 'collision' && <SimulatorCard />}
            {card.type === 'summary' && <SummaryCard card={card} />}
            {card.type === 'quiz' && <QuizCardGroup card={card} />}
          </div>
        )}
      </div>
    </motion.div>
  );
}
