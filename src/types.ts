export type AgentRole = 'teacher' | 'student_a' | 'student_b' | 'assistant' | 'student';

export interface SourceRef {
  id: string;
  title: string;
  page: string;
  highlight?: string;
}

export interface ChatMessage {
  id: string;
  role: AgentRole;
  content: string;
  source?: SourceRef;
}

export type CardType = 'knowledge' | 'simulator' | 'quiz' | 'summary';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface BoardCard {
  id: string;
  type: CardType;
  simulatorType?: string;
  isElastic?: boolean;
  title: string;
  content?: string;
  formula?: string;
  pitfall?: string;
  sourceId?: string;
  tags?: string[];
  questions?: QuizQuestion[];
  x: number;
  y: number;
  width?: number;
  height?: number;
  scale?: number;
  isPinned?: boolean;
}

export interface SimulationStep {
  id: number;
  messages: ChatMessage[];
  newCards: BoardCard[];
}
