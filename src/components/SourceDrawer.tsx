import { FileText, ChevronRight, ChevronLeft, BookOpen, Layers, Check, UploadCloud, Link as LinkIcon, Database, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSourceId?: string;
}

type SourceType = {
  id: string;
  title: string;
  desc: string;
  activeRegex: RegExp;
  icon: any;
};

const PPT_SOURCE: SourceType = { id: 'ppt_1', title: '动量定理 PPT', desc: 'GaoKao 物理总复习', activeRegex: /^PPT/, icon: FileText };
const BANK_SOURCES: SourceType[] = [
  { id: 'bank_1', title: '高考必刷题 - 物理动量篇', desc: '包含 150 道历年高考经典大题、选择题与详细知识点切片解析', activeRegex: /^Question/, icon: Database },
  { id: 'exam_1', title: '2023-2024 全国高考真题汇编', desc: '包含新课标卷、全国甲卷物理压轴题', activeRegex: /^Exam/, icon: BookOpen },
];

export function SourceDrawer({ isOpen, onClose, activeSourceId }: SourceDrawerProps) {
  const [sources, setSources] = useState<SourceType[]>([]);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [isUploadingUrl, setIsUploadingUrl] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (activeSourceId) {
      const matched = sources.find(s => s.activeRegex.test(activeSourceId));
      if (matched) setPreviewId(matched.id);
    }
  }, [activeSourceId, sources]);

  const handleLocalUpload = () => {
    if (sources.some(s => s.id === PPT_SOURCE.id)) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploadingLocal(true);
      setTimeout(() => {
        setSources(prev => [...prev, PPT_SOURCE]);
        setSelectedSources(prev => new Set([...prev, PPT_SOURCE.id]));
        setPreviewId(PPT_SOURCE.id);
        setIsUploadingLocal(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    }
  };

  const handleUrlImport = () => {
    if (sources.some(s => s.id === BANK_SOURCES[0].id)) return;
    setShowUrlDialog(true);
  };

  const toggleSource = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedSources);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSources(next);
  };

  const renderPreviewContent = () => {
    if (previewId === 'bank_1' || previewId === 'exam_1') {
      return (
        <div className="bg-white rounded-[24px] p-5 border border-slate-200/60 text-[14px] text-slate-700 leading-relaxed shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-bl-[64px] -z-10"></div>
          <p className="font-bold text-slate-900 mt-2 mb-4 text-lg tracking-tight">
            2023年新课标卷物理真题
          </p>
          <div className="bg-surface-container border border-slate-200/50 mt-2 p-5 rounded-[20px] font-medium text-slate-700 leading-loose shadow-inner gap-2 flex flex-col">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {`如图所示，光滑水平面上放置一质量为 $M$ 的木板，一质量为 $m$ 的子弹以初速度 $v_0$ 射入木板并最终停在木板中。求系统在这个过程中损失的机械能。`}
            </ReactMarkdown>
          </div>
          <div className="mt-5 p-4 bg-emerald-50/50 border border-emerald-100/80 rounded-[20px]">
             <strong className="text-emerald-700 flex items-center gap-2 mb-2 text-[14px]">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                解析要点
             </strong>
             <div className="text-[13px] text-emerald-800/80 leading-relaxed flex flex-col gap-1 prose-p:my-1">
               <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                 {`动量守恒建立方程 $m v_0 = (m+M)v'$，再结合能量守恒定理计算发热损失 $\\Delta E = \\frac{1}{2}m v_0^2 - \\frac{1}{2}(m+M)v'^2$。`}
               </ReactMarkdown>
             </div>
          </div>
        </div>
      );
    }
    return (
       <div className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-200/50 text-[13px] text-slate-400 text-center border-dashed font-bold tracking-widest uppercase">
         请选择材料以预览内容
       </div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -400 }}
          animate={{ x: 0 }}
          exit={{ x: -400 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onMouseLeave={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            if (
              e.clientX < rect.left ||
              e.clientX >= rect.right ||
              e.clientY < rect.top ||
              e.clientY >= rect.bottom
            ) {
              onClose();
            }
          }}
          className={cn(
            "absolute top-0 left-0 bottom-0 w-[400px] bg-surface-container border-r border-slate-200/50 z-50 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.1)] flex flex-col"
          )}
        >
          <div className="flex items-center justify-between px-7 py-6 border-b border-primary-50/50 shrink-0">
            <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <Layers className="w-5 h-5 text-primary-500" />
                Agent 知识库
                </h2>
                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Knowledge Base</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-7 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> 挂载的参考资料
              </h3>
              <div className="space-y-4">
                {sources.length === 0 && (
                  <div className="text-[13px] text-slate-400 text-center py-6 border border-dashed border-slate-200/60 rounded-[20px] bg-slate-50/50">
                    暂无参考资料，请从下方添加
                  </div>
                )}
                {sources.map((source) => {
                  const isSelected = selectedSources.has(source.id);
                  const isActivePreview = previewId === source.id || (activeSourceId && source.activeRegex.test(activeSourceId));
                  
                  return (
                    <div key={source.id} 
                        onClick={() => setPreviewId(source.id)}
                        className={cn(
                      "p-4 rounded-[24px] border transition-all cursor-pointer group flex items-start gap-4",
                      isActivePreview
                        ? "border-primary-300 bg-primary-50/60 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.15)]" 
                        : "border-slate-200/60 bg-white hover:border-primary-300 hover:shadow-md"
                    )}>
                       <div 
                          className={cn(
                            "w-5 h-5 rounded-[6px] flex items-center justify-center border-[2px] transition-all cursor-pointer shrink-0 mt-2",
                            isSelected ? "bg-primary-600 border-primary-600 text-white shadow-sm" : "border-slate-300 bg-white text-transparent hover:border-primary-400"
                          )}
                          onClick={(e) => toggleSource(source.id, e)}
                       >
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                       </div>

                       <div className="flex-1 min-w-0">
                         <div className="flex items-start gap-3">
                           <div className={cn("mt-0.5 p-2 rounded-[12px] transition-colors", isActivePreview ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600")}>
                             <source.icon className="w-4 h-4" />
                           </div>
                           <div>
                             <h4 className="text-[14px] font-bold text-slate-800 tracking-tight leading-tight mb-1" style={{ wordBreak: 'break-all' }}>{source.title}</h4>
                             <p className="text-[12px] text-slate-500 font-medium leading-relaxed" style={{ wordBreak: 'break-all' }}>{source.desc}</p>
                           </div>
                         </div>
                         
                         {(activeSourceId && source.activeRegex.test(activeSourceId)) && (
                           <div className="mt-4 flex items-center gap-2 text-[12px] text-primary-600 font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-primary-100/50 w-fit">
                             <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                             已定位至 {activeSourceId}
                           </div>
                         )}
                       </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> 添加新资料
              </h3>
              <div className="grid grid-cols-2 gap-3 relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".ppt,.pptx,.pdf,.doc,.docx"
                />
                <button 
                  onClick={handleLocalUpload}
                  disabled={isUploadingLocal || sources.some(s => s.id === PPT_SOURCE.id)}
                  className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-[24px] border border-slate-200/60 bg-white hover:border-[#e9d5ff] hover:bg-purple-50/50 transition-colors group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                   <div className="p-2.5 bg-slate-50 group-hover:bg-purple-100 rounded-full transition-colors">
                     {isUploadingLocal ? (
                       <Loader2 className="w-5 h-5 text-[#a855f7] animate-spin" />
                     ) : (
                       <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-[#a855f7] transition-colors" />
                     )}
                   </div>
                   <span className="text-[12px] font-bold text-slate-600 group-hover:text-[#a855f7] tracking-wider">
                     {isUploadingLocal ? '上传中...' : '本地上传'}
                   </span>
                </button>
                <button 
                  onClick={handleUrlImport}
                  disabled={isUploadingUrl || sources.some(s => s.id === BANK_SOURCES[0].id)}
                  className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-[24px] border border-slate-200/60 bg-white hover:border-[#e9d5ff] hover:bg-purple-50/50 transition-colors group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                   <div className="p-2.5 bg-slate-50 group-hover:bg-purple-100 rounded-full transition-colors">
                     {isUploadingUrl ? (
                       <Loader2 className="w-5 h-5 text-[#a855f7] animate-spin" />
                     ) : (
                       <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-[#a855f7] transition-colors" />
                     )}
                   </div>
                   <span className="text-[12px] font-bold text-slate-600 group-hover:text-[#a855f7] tracking-wider">
                     {isUploadingUrl ? '导入中...' : '导入链接'}
                   </span>
                </button>
              </div>
            </div>
            
            <div className="relative">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> 内容片段预览
              </h3>
              {renderPreviewContent()}
            </div>



          </div>
        </motion.div>
      )}

      {/* Centered URL Dialog Overlay */}
      {showUrlDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[24px] p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/60 w-[480px] flex flex-col"
          >
            <h4 className="text-[18px] font-bold text-slate-800 mb-2">导入题库链接</h4>
            <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
              系统已支持自动抓取并结构化解析以下经典题库网站的题目：<br/>
              <span className="font-bold text-primary-600 mt-1 inline-block">菁优网、猿题库、学科网、高考直通车、百度文库</span>
            </p>
            <input 
              type="text" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="输入题库资源网址 (如 https://www.jyeoo.com/...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all mb-6"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && urlInput.trim()) {
                  setShowUrlDialog(false);
                  setIsUploadingUrl(true);
                  setTimeout(() => {
                    setSources(prev => [...prev, ...BANK_SOURCES]);
                    setSelectedSources(prev => new Set([...prev, BANK_SOURCES[0].id, BANK_SOURCES[1].id]));
                    setPreviewId(BANK_SOURCES[0].id);
                    setIsUploadingUrl(false);
                    setUrlInput('');
                  }, 1500);
                }
              }}
            />
            <div className="flex gap-3 justify-end mt-auto">
              <button 
                onClick={() => setShowUrlDialog(false)}
                className="px-5 py-2.5 rounded-xl text-[14px] font-medium text-slate-500 hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  if (!urlInput.trim()) return;
                  setShowUrlDialog(false);
                  setIsUploadingUrl(true);
                  setTimeout(() => {
                    setSources(prev => [...prev, ...BANK_SOURCES]);
                    setSelectedSources(prev => new Set([...prev, BANK_SOURCES[0].id, BANK_SOURCES[1].id]));
                    setPreviewId(BANK_SOURCES[0].id);
                    setIsUploadingUrl(false);
                    setUrlInput('');
                  }, 1500);
                }}
                className="px-5 py-2.5 rounded-xl text-[14px] font-bold bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
              >
                自动抓取并导入
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
