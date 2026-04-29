import { useEffect, useRef } from 'react';
import { BoardCard } from '../types';
import { RenderBoardCard } from './BoardCards';

interface BoardProps {
  cards: BoardCard[];
  onUpdatePosition?: (id: string, x: number, y: number) => void;
  onUpdateCard?: (id: string, updates: Partial<BoardCard>) => void;
}

export function Board({ cards, onUpdatePosition, onUpdateCard }: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="flex-1 relative overflow-hidden bg-surface border-r border-slate-200/50"
      ref={containerRef}
    >
      {/* 点阵背景 */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: 'radial-gradient(oklch(0.85 0.05 264) 1.5px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* 环境光晕 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-50">
         <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-100 rounded-full blur-3xl"></div>
         <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl"></div>
      </div>
      
      {/* 白板内容 */}
      <div className="absolute inset-0 z-0">
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-slate-200/80 tracking-tighter select-none">
            MOMENTUM
            <br />THEOREM
          </h1>
        </div>
      </div>

      <div className="absolute inset-0 z-10 p-6 overflow-hidden">
        {cards.map(card => (
          <RenderBoardCard 
            key={card.id} 
            card={card} 
            onUpdatePosition={onUpdatePosition}
            onUpdateCard={onUpdateCard}
          />
        ))}
      </div>
    </div>
  );
}
