import axios from 'axios';
import type { LessonPlan, PaginatedResponse } from '../types/lessonPlan';
import { API_URL } from '../constants/api';

export interface LessonPlanFilters {
  page?: number;
  per_page?: number;
  titulo?: string;
  disciplina?: string;
  tag?: string;
  data_prevista?: string;
  order_by?: 'titulo' | 'criado_em';
}

export async function getLessonPlans(
  filters: LessonPlanFilters = {}
): Promise<PaginatedResponse> {
  const response = await axios.get(`${API_URL}/lesson-plans/`, {
    params: filters,
  });
  return response.data;
}

export async function getLessonPlanById(id: string): Promise<LessonPlan> {
  const response = await axios.get(`${API_URL}/lesson-plans/${id}`);
  return response.data;
}

export async function createLessonPlan(
  data: Omit<LessonPlan, 'id' | 'criado_em' | 'atualizado_em'>
): Promise<LessonPlan> {
  const response = await axios.post(`${API_URL}/lesson-plans/`, data);
  return response.data;
}

export async function updateLessonPlan(
  id: string,
  data: Partial<LessonPlan>
): Promise<LessonPlan> {
  const response = await axios.put(`${API_URL}/lesson-plans/${id}`, data);
  return response.data;
}

export async function deleteLessonPlan(id: string): Promise<void> {
  await axios.delete(`${API_URL}/lesson-plans/${id}`);
}

export interface LessonPlanMeta {
  titulos: string[];
  disciplinas: string[];
  tags: string[];
}

export async function getLessonPlanMeta(): Promise<LessonPlanMeta> {
  const response = await axios.get(`${API_URL}/lesson-plans/meta`);
  return response.data;
}
