// types.ts
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion: string;
}
