import { useState, useEffect } from 'react';
import { SourceDrawer } from './components/SourceDrawer';
import { AgentChat } from './components/AgentChat';
import { Board } from './components/Board';
import { simulationSteps } from './mockData';
import { ChatMessage, BoardCard, AgentRole } from './types';
import { BookOpen, RefreshCcw } from 'lucide-react';

const NEXT_STEP_CANDIDATE_TEXTS = [
  "探讨：动量和冲量有什么区别？",
  "探讨：非恒力或方向改变时怎么办？",
  "申请动态演示",
  "引申：多物体系统的动量守恒",
  "申请碰撞动画演示",
  "本节课堂小结",
  "开始随堂连测",
];

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>(simulationSteps[0].messages);
  const [cards, setCards] = useState<BoardCard[]>([]);

  // 模拟状态
  const [messageQueue, setMessageQueue] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingRole, setTypingRole] = useState<AgentRole | null>(null);

  // 知识库抽屉状态
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState<string | undefined>();

  const resolveCollisions = (cards: BoardCard[], activeId?: string) => {
    let nextCards = cards.map(c => ({...c}));
    const GRID = 40;
    const padding = 20;
    let overlaps = true;
    let iter = 0;
    
    // 最大迭代次数，使用 MTV 应能快速收敛
    while (overlaps && iter < 10) {
      overlaps = false;
      iter++;

      // 使用有序循环避免重复处理和来回跳跃
      for (let i = 0; i < nextCards.length; i++) {
        for (let j = i + 1; j < nextCards.length; j++) {
          let c1 = nextCards[i];
          let c2 = nextCards[j];
          
          // 计算含缩放比例的逻辑尺寸
          const w1 = (c1.width || 360) * (c1.scale || 1);
          const h1 = (c1.height || 360) * (c1.scale || 1);
          
          const w2 = (c2.width || 360) * (c2.scale || 1);
          const h2 = (c2.height || 360) * (c2.scale || 1);
          
          if (c1.x < c2.x + w2 + padding && c1.x + w1 + padding > c2.x &&
              c1.y < c2.y + h2 + padding && c1.y + h1 + padding > c2.y) {
            
            overlaps = true;
            
            let anchor = c1;
            let target = c2;
            let aw = w1, ah = h1;
            let tw = w2, th = h2;

            // 确定锚定卡片与被推开的卡片
            if (c1.id === activeId || (c1.isPinned && !c2.isPinned)) {
              anchor = c1; target = c2; aw = w1; ah = h1; tw = w2; th = h2;
            } else if (c2.id === activeId || (c2.isPinned && !c1.isPinned)) {
              anchor = c2; target = c1; aw = w2; ah = h2; tw = w1; th = h1;
            } else {
              // 都不是活动/固定时，推开位置更低的卡片
              if (c2.y > c1.y + 10 || (Math.abs(c2.y - c1.y) <= 10 && c2.x > c1.x)) {
                anchor = c1; target = c2; aw = w1; ah = h1; tw = w2; th = h2;
              } else {
                anchor = c2; target = c1; aw = w2; ah = h2; tw = w1; th = h1;
              }
            }

            if (target.isPinned) {
               overlaps = false; // 均为固定或不可解决
               continue;
            }

            // 最小平移向量 (MTV)
            const pushRight = (anchor.x + aw + padding) - target.x;
            const pushLeft = (anchor.x - tw - padding) - target.x;
            const pushDown = (anchor.y + ah + padding) - target.y;
            const pushUp = (anchor.y - th - padding) - target.y;

            const absRight = Math.abs(pushRight);
            const absLeft = Math.abs(pushLeft);
            const absDown = Math.abs(pushDown);
            const absUp = Math.abs(pushUp);

            // 代价启发：优先向下推开，左/上方向施加额外惩罚
            const minCost = Math.min(absDown * 1.0, absRight * 1.2, absLeft * 2.5, absUp * 3.0);

            if (minCost === absDown * 1.0) {
               target.y = Math.ceil((target.y + pushDown) / GRID) * GRID;
            } else if (minCost === absRight * 1.2) {
               target.x = Math.ceil((target.x + pushRight) / GRID) * GRID;
            } else if (minCost === absLeft * 2.5) {
               target.x = Math.floor((target.x + pushLeft) / GRID) * GRID;
            } else {
               target.y = Math.floor((target.y + pushUp) / GRID) * GRID;
            }
          }
        }
      }
    }
    return nextCards;
  };

  // 拖拽更新卡片位置
  const handleUpdateCardPosition = (id: string, x: number, y: number) => {
    setCards(prev => {
      const next = prev.map(c => c.id === id ? { ...c, x, y } : c);
      return resolveCollisions(next, id);
    });
  };

  const handleUpdateCardProperties = (id: string, updates: Partial<BoardCard>) => {
    setCards(prev => {
      const next = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      if (updates.width || updates.height || updates.scale !== undefined) {
        return resolveCollisions(next, id);
      }
      return next;
    });
  };

  // 自动排列：寻找 40px 网格中的下一个空位
  const findEmptySpot = (existingCards: BoardCard[], defaultX: number, defaultY: number, targetWidth = 360, targetHeight = 340) => {
    const GRID = 40;
    const padding = 20;
    const BOARD_W = window.innerWidth - 320; // minus chat bar

    for (let y = 60; y < 2000; y += GRID) {
      for (let x = 40; x < Math.max(BOARD_W, 800) - targetWidth; x += GRID) {
        let overlap = false;
        for (const card of existingCards) {
          const w = (card.width || 360) * (card.scale || 1);
          const h = (card.height || 360) * (card.scale || 1);
          
          if (x < card.x + w + padding && x + targetWidth + padding > card.x &&
              y < card.y + h + padding && y + targetHeight + padding > card.y) {
            overlap = true;
            break;
          }
        }
        if (!overlap) {
          return { x, y };
        }
      }
    }
    return { x: defaultX, y: defaultY };
  };

  // 消息队列逐条播放效果
  useEffect(() => {
    if (messageQueue.length > 0) {
      const nextMsg = messageQueue[0];
      setIsTyping(true);
      setTypingRole(nextMsg.role);

      // Quicker typing delay to fix long waits and hangs
      const delay = Math.min(400 + nextMsg.content.length * 15, 1200);

      const timer = setTimeout(() => {
        setVisibleMessages((prev) => [...prev, nextMsg]);
        
        if (messageQueue.length === 1) {
          setCards(prev => {
            const currentIds = new Set(prev.map(c => c.id));
            const toAddOriginal = (simulationSteps[stepIndex].newCards || []).filter(c => !currentIds.has(c.id));
            
            let currentCards = [...prev];
            toAddOriginal.forEach(c => {
               const width = (c.width || 360) * (c.scale || 1);
               const height = (c.height || 360) * (c.scale || 1);
               const pos = findEmptySpot(currentCards, c.x, c.y, width, height);
               const newCard = { ...c, x: pos.x, y: pos.y };
               currentCards = [...currentCards, newCard];
            });

            return currentCards;
          });
        }

        setMessageQueue((prev) => prev.slice(1));
        setIsTyping(false);
        setTypingRole(null);
      }, delay);

      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- 仅在 messageQueue 变化时触发
  }, [messageQueue]);

  // 推进模拟步进
  const handleNextStep = () => {
    if (stepIndex < simulationSteps.length - 1 && messageQueue.length === 0 && !isTyping) {
      const nextIdx = stepIndex + 1;
      setStepIndex(nextIdx);
      setMessageQueue(simulationSteps[nextIdx].messages);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setVisibleMessages(simulationSteps[0].messages);
    setMessageQueue([]);
    setIsTyping(false);
    setTypingRole(null);
    setCards([]);
    setIsSourceOpen(false);
    setActiveSourceId(undefined);
  };

  const handleSourceClick = (sourceId: string) => {
    setActiveSourceId(sourceId);
    setIsSourceOpen(true);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-surface overflow-hidden text-slate-900 font-sans">
      
      {/* Top Header / App Chrome */}
      <header className="h-16 shrink-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-40 flex items-center justify-between px-6 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-[14px] flex items-center justify-center shadow-[0_4px_10px_rgba(79,70,229,0.2)]">
             <span className="text-white font-black text-base select-none">Au</span>
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight">Aurora Classroom</h1>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">动量定理 · Live Demo</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-all flex items-center gap-2 text-sm font-semibold active:scale-[0.98]"
            title="Reset Demo"
          >
            <RefreshCcw className="w-4 h-4" />
            重置演示
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex relative z-0 overflow-hidden">
        
        {/* Edge trigger for Source Drawer */}
        {!isSourceOpen && (
          <div
            onMouseEnter={() => setIsSourceOpen(true)}
            className="absolute left-0 top-0 bottom-0 w-8 z-40 bg-gradient-to-r from-slate-900/5 to-transparent opacity-0 hover:opacity-100 transition-opacity cursor-pointer group flex items-center"
          >
            <div className="w-1.5 h-16 bg-slate-300/80 rounded-full ml-1 shadow-sm group-hover:bg-primary-400/80 transition-colors"></div>
          </div>
        )}

        <SourceDrawer 
          isOpen={isSourceOpen} 
          onClose={() => setIsSourceOpen(false)} 
          activeSourceId={activeSourceId}
        />
        
        <Board cards={cards} onUpdatePosition={handleUpdateCardPosition} onUpdateCard={handleUpdateCardProperties} />
        
        <AgentChat 
          messages={visibleMessages} 
          onNextStep={handleNextStep} 
          onSourceClick={handleSourceClick}
          canAdvance={stepIndex < simulationSteps.length - 1 && messageQueue.length === 0 && !isTyping}
          nextCandidateText={NEXT_STEP_CANDIDATE_TEXTS[stepIndex]}
          isTyping={isTyping}
          typingRole={typingRole}
        />
      </main>
      
    </div>
  );
}
