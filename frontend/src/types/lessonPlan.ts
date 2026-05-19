export interface LessonPlan {
  id: string;
  titulo: string;
  objetivo: string;
  ementa: string;
  data_prevista: string | null;
  disciplina: string;
  conteudos: string | null;
  recursos_apoio: string | null;
  tags: string | null;
  criado_em: string;
  atualizado_em: string;
}

export interface SmartAssistResponse {
  conteudos_complementares: string[];
  topicos_relacionados: string[];
  tags: string[];
}

export interface PaginatedResponse {
  items: LessonPlan[];
  total: number;
  pages: number;
  page: number;
  per_page: number;
}
