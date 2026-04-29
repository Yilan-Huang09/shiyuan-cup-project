import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentRole, ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { Settings, Play, ArrowRight, CornerDownRight, Link2, Send, Sparkles, X, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface AgentChatProps {
  messages: ChatMessage[];
  onNextStep: () => void;
  onSourceClick: (sourceId: string) => void;
  canAdvance: boolean;
  nextCandidateText?: string;
  isTyping?: boolean;
  typingRole?: AgentRole | null;
}

const initialRoleConfig: Record<AgentRole, { name: string; color: string; bg: string; dot: string }> = {
  teacher: { name: 'Teacher', color: 'text-primary-700', bg: 'bg-primary-50 border-primary-200/50', dot: 'bg-primary-500' },
  student: { name: 'You', color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200/50', dot: 'bg-slate-500' },
  student_a: { name: 'Student A', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200/50', dot: 'bg-amber-500' },
  student_b: { name: 'Student B', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200/50', dot: 'bg-rose-500' },
  assistant: { name: 'Assistant', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200/50', dot: 'bg-emerald-500' },
};

const AVATARS: Record<AgentRole, string> = {
  teacher: "https://api.dicebear.com/7.x/notionists/svg?seed=Toby&backgroundColor=e0e7ff",
  student: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f1f5f9",
  student_a: "https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=ffedd5",
  student_b: "https://api.dicebear.com/7.x/notionists/svg?seed=Jocelyn&backgroundColor=ffe4e6",
  assistant: "https://api.dicebear.com/7.x/bottts/svg?seed=Cody&backgroundColor=dcfce7"
};

export function AgentChat({ messages, onNextStep, onSourceClick, canAdvance, nextCandidateText, isTyping, typingRole }: AgentChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [roleConfig, setRoleConfig] = useState(initialRoleConfig);
  const [configRole, setConfigRole] = useState<AgentRole | null>(null);
  const [activePopoverMsgId, setActivePopoverMsgId] = useState<string | null>(null);
  const [width, setWidth] = useState(320);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 280), 800);
      setWidth(newWidth);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleNameChange = (newName: string) => {
    if (!configRole) return;
    setRoleConfig(prev => ({
      ...prev,
      [configRole]: { ...prev[configRole], name: newName }
    }));
  };

  return (
    <div 
      className="bg-surface-container border-l border-slate-200/50 flex flex-col h-full shadow-[inset_1px_0_0_rgba(255,255,255,0.5)] z-20 relative shrink-0"
      style={{ width: `${width}px` }}
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary-400/50 active:bg-primary-500/60 transition-colors z-50 flex items-center justify-center group"
        onMouseDown={startResizing}
      >
        <div className="h-8 w-0.5 bg-slate-300 rounded-full group-hover:bg-white transition-colors" />
      </div>
      <div className="p-4 border-b border-primary-50 bg-white/50 backdrop-blur-sm flex items-center justify-between shrink-0">
        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          Agent Team
          <span className="flex h-1.5 w-1.5 relative mt-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary-500"></span>
          </span>
        </h2>
        <div className="flex -space-x-2">
           {Object.entries(AVATARS).map(([role, src]) => (
              <div 
                key={role} 
                onClick={() => setConfigRole(role as AgentRole)}
                className="relative group cursor-pointer hover:z-10 transition-transform hover:scale-110"
              >
                 <img src={src} className="w-8 h-8 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] bg-surface" alt={role} />
                 <div className="absolute inset-x-0 -bottom-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">{roleConfig[role as AgentRole].name}</span>
                 </div>
              </div>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6" ref={scrollRef}>
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const config = roleConfig[msg.role];
            const isStudent = msg.role === 'student';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={cn("flex flex-col w-full gap-1.5", isStudent ? "items-end" : "items-start")}
              >
                <div className={cn("flex items-center gap-2 mb-1", isStudent ? "flex-row-reverse" : "flex-row")}>
                  <img src={AVATARS[msg.role]} alt={config.name} className="w-6 h-6 rounded-full border border-slate-200/50 shrink-0 bg-white shadow-sm object-cover" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    {config.name}
                  </span>
                </div>
                
                <div className={cn(
                  "px-4 py-3 rounded-[24px] text-[15px] border shadow-sm w-fit max-w-[92%] leading-relaxed [&_p]:my-1",
                  isStudent ? "rounded-tr-[8px]" : "rounded-tl-[8px]",
                  config.bg, 
                  config.color,
                  msg.role === 'assistant' ? 'border-dashed' : ''
                )}>
                  <div>
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {msg.source && (
                  <div 
                    className={cn("relative", isStudent ? "mr-2" : "ml-2")}
                    onMouseEnter={() => setActivePopoverMsgId(msg.id)}
                    onMouseLeave={() => setActivePopoverMsgId(null)}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSourceClick(msg.source!.page);
                      }}
                      className={cn(
                        "mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-primary-700 bg-white hover:bg-primary-50 px-3.5 py-1.5 rounded-full border border-slate-200/60 transition-all shadow-sm w-fit active:scale-95 group"
                      )}
                    >
                      <Link2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      引用: {msg.source.title} · {msg.source.page}
                    </button>
                    
                    <AnimatePresence>
                      {activePopoverMsgId === msg.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            "absolute top-full mt-2 z-50 w-[320px] bg-white rounded-2xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.2)] border border-slate-200/60 p-3",
                            isStudent ? "right-0" : "left-0"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2 px-1">
                             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" /> 原生幻灯片预览
                             </div>
                          </div>
                          
                          <div className="aspect-[16/9] relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200/50 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] flex flex-col p-4">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 to-indigo-400"></div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-bl-full pointer-events-none"></div>
                            
                            <div className="text-[10px] font-bold text-primary-600/60 absolute top-4 left-4 tracking-wider">
                              {msg.source.title} · {msg.source.page}
                            </div>
                            
                            <div className="mt-4 flex-1 flex flex-col justify-center items-center text-center relative z-10">
                               {msg.source.id === 'ppt_2' ? (
                                 <>
                                   <h3 className="text-[17px] font-black text-slate-800 mb-2">冲量 (Impulse)</h3>
                                   <div className="bg-white/90 px-4 py-2 rounded-xl border border-slate-200 shadow-sm mt-1 text-primary-700 font-bold text-[14px]">
                                     <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                       {`$$I = F \\cdot t$$`}
                                     </ReactMarkdown>
                                   </div>
                                   <p className="text-[11px] text-slate-500 mt-4 font-medium tracking-wide">力在时间上的积累效果，属于矢量</p>
                                 </>
                               ) : msg.source.id === 'ppt_3' ? (
                                 <>
                                   <h3 className="text-[17px] font-black text-slate-800 mb-2">动量定理</h3>
                                   <div className="bg-white/90 px-4 py-2 rounded-xl border border-slate-200 shadow-sm mt-1 text-primary-700 font-bold text-[14px]">
                                     <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                       {`$$I = \\Delta p$$`}
                                     </ReactMarkdown>
                                   </div>
                                   <p className="text-[11px] text-slate-500 mt-4 font-medium tracking-wide">合外力的冲量 = 动量的变化量</p>
                                 </>
                               ) : (
                                 <>
                                   <h3 className="text-[18px] font-black text-slate-800 mb-2">动量与冲量</h3>
                                   <p className="text-[13px] text-slate-500 font-bold mt-2 bg-slate-200/50 px-3 py-1 rounded-full">第二章 · 核心概念</p>
                                 </>
                               )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && typingRole && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className={cn("flex flex-col gap-1 mt-4", typingRole === 'student' ? 'items-end' : 'items-start')}
          >
            <div className={cn("flex items-center gap-2 mb-1", typingRole === 'student' ? 'flex-row-reverse' : 'flex-row')}>
              <img src={AVATARS[typingRole]} alt={roleConfig[typingRole].name} className="w-5 h-5 rounded-full border border-slate-200/50 shrink-0 bg-white shadow-sm" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {roleConfig[typingRole].name} 正在输出...
              </span>
            </div>
            <div className={cn(
              "px-4 py-3 rounded-[20px] w-fit border shadow-sm bg-surface-container border-slate-200/50 flex items-center gap-1.5",
              typingRole === 'student' ? 'rounded-tr-[8px]' : 'rounded-tl-[8px]'
            )}>
              <span className="flex space-x-1.5 px-1 py-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Input Area with Candidate Actions */}
      <div className="p-5 border-t border-slate-100 bg-white/80 backdrop-blur-md flex flex-col gap-3 relative pb-8 shrink-0 z-20">
        <AnimatePresence>
          {canAdvance && nextCandidateText && !isTyping && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute -top-14 left-0 right-0 flex justify-center px-4 z-20"
            >
              <button
                onClick={onNextStep}
                className="px-6 py-3 bg-white border border-primary-200/50 text-primary-700 shadow-[0_8px_30px_rgba(79,70,229,0.12)] rounded-full text-[14px] font-bold flex items-center gap-2 hover:bg-primary-50 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-primary-500/20 text-primary-500" />
                {nextCandidateText}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center p-2 bg-surface-container border-0 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-all focus-within:bg-primary-50/50 focus-within:shadow-[inset_0_2px_4px_rgba(79,70,229,0.05),0_0_0_2px_rgba(79,70,229,0.2)]">
          <input 
            type="text" 
            placeholder="输入你的消息..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent pl-5 pr-14 py-3 text-[15px] text-slate-800 focus:outline-none placeholder:text-slate-400 font-medium" 
            disabled 
          />
          <button 
            disabled 
            className="absolute right-2 w-11 h-11 bg-primary-600 rounded-full shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] flex items-center justify-center text-white opacity-90 cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Config Overlay Modal */}
      <AnimatePresence>
        {configRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-[32px]"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <img src={AVATARS[configRole]} className="w-14 h-14 rounded-full border-2 border-slate-100 bg-white shadow-sm" alt="avatar" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">配置 Agent 角色</h3>
                  <p className="text-[11px] uppercase tracking-widest font-bold text-primary-600 mt-1">{configRole}</p>
                </div>
              </div>
              <button 
                onClick={() => setConfigRole(null)} 
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">显示名称 (Name)</label>
                <input 
                  type="text" 
                  value={roleConfig[configRole].name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-surface-container border border-slate-200/50 rounded-2xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 font-medium text-slate-800 shadow-sm transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">角色人设指令 (System Prompt)</label>
                <textarea 
                  className="w-full bg-surface-container border border-slate-200/50 rounded-2xl px-4 py-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-slate-600 h-28 resize-none shadow-sm transition-all leading-relaxed"
                  placeholder="输入给该 Agent 的角色指令..."
                  defaultValue={`你目前扮演团队中的 ${configRole} 角色。请参考以下设定完成推理或对话...`}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">知识库引用偏好</label>
                <select className="w-full bg-surface-container border border-slate-200/50 rounded-2xl px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-300 text-slate-700 font-medium shadow-sm transition-all appearance-none cursor-pointer">
                  <option>严格基于提供材料的来源</option>
                  <option>允许补充外部常识知识</option>
                  <option>自由发散回答</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100/50 mt-auto">
              <button 
                onClick={() => setConfigRole(null)} 
                className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-[15px] font-bold transition-all shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] active:scale-[0.98]"
              >
                保存配置并关闭
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
