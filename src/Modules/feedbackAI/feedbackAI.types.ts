export interface FeedbackInput {
  tipo_feedback_id: 1 | 2 | 3;
  tipo_erro_id?: 1 | 2 | 3 | 4 | 5 | 6 | null;
  titulo?: string;
  objetivos?: string[];
  codigo?: string;
  output?: string;
  erro?: string;
  tentativa?: number; 
}

export interface FeedbackOutput {
  success: boolean
  feedback: string
}