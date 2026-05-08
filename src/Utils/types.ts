// ================================
// Aluno
// ================================
export interface Aluno {
  id: number;
  nome: string;
  email: string;
  password?: string;
  senha?: string;
  numero: number;
  turma: string;
  escola: string;
  ano: number;
  ano_letivo: string;
  avatar_id: number;
  heroi_id: number;
}

export interface CriarAlunoDTO {
  nome: string;
  email: string;
  password: string;
  numero: number;
  turma: string;
  escola: string;
  ano: number;
  ano_letivo: string;
  avatar_id: number;
  heroi_id: number;
}

// ================================
// Auth
// ================================
export interface LoginResponse {
  token: string;
  user: Omit<Aluno, 'password' | 'senha'>;
}

export interface JwtPayload {
  id: number;
  email: string;
}

// ================================
// Progresso
// ================================
export interface ProgressoAluno {
  id: number;
  aluno_id: number;
  xp: number;
  nivel_atual: number;
  coins: number;
  streak: number;
  tempo_total_jogo: number;
  mapa_atual: number;
  ultimo_login: Date;
}

// ================================
// Desafio
// ================================
export interface Desafio {
  id: number;
  nivel_id: number;
  nome: string;
  descricao: string;
  xp_recompensa: number;
  ordem: number;
}

export interface Nivel {
  id: number;
  mapa_id: number;
  nivel: number;
  nome: string;
  descricao: string;
  xp_recompensa: number;
  total_desafios: number;
}

// ================================
// Concluir Desafio
// ================================

export interface ConcluirDesafioDTO {
  respostas_certas?: number;
  respostas_erradas?: number;
  ajudas_usadas?: number;
  tempo_desafio?: number;
  score?: number;
  tipo_erro_id?: number | null;
  tipo_feedback_id?: number | null;
  feedback_ia?: string | null;
}

export interface ConcluirDesafioResponse {
  sucesso: boolean;
  primeiraVez: boolean;
  xpGanho: {
    desafio: number;
    nivelBonus: number;
    total: number;
  };
  nivelCompleto: boolean;
  nivelMaximo: boolean;
  proximoNivel: any;
  progressao: any;
  novoStreak?: number;
}

export interface DesempenhoXP {
  xp: number;
  progressao: ReturnType<typeof import('./xpSystem').calcularNivel>;
}

export interface DesempenhoDesafio {
  aluno_id: number;
  desafio_id: number;
  respostas_certas: number;
  respostas_erradas: number;
  tentativas: number;
  ajudas_usadas: number;
  tempo_desafio: number | null;
  score: number;
  feedback_ia: string | null;
  data_execucao: Date;
}

export interface DesempenhoAluno {
  aluno_id: number;
  total_registos: number;
  desempenhos: DesempenhoDesafio[];
}

export interface NivelComDesafios {
  id: number;
  nome: string;
  nivel: number
  descricao: string;
  xp: number;
  total_desafios: number;

  desafios: {
    id: number;
    nome: string;
    descricao: string;
    xp: number;
    ordem: number;
  }[];
}


// Mapas
export interface Mapa {
  id: number;
  nome: string;
  descricao: string;
  ordem: number;
}

export interface MapaProgresso {
  mapa: number;
  nome: string;
  ordem: number;
  total_desafios: number;
  desafios_completos: number;
  porcentagem: number;
  desbloqueado: boolean;
}

export interface DashboardStats {
  xp_total: number;
  nivel_atual: number;
  coins: number;
  streak: number;
  tempo_total_jogo: number;
  desafios_completos: number;
  total_desafios: number;
  porcentagem_completa: number;
}