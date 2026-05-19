import axios from 'axios';
import type { SmartAssistResponse } from '../types/lessonPlan';
import { API_URL } from '../constants/api';

export interface SmartAssistRequest {
  titulo: string;
  disciplina: string;
  ementa: string;
}

export async function getRecommendations(
  data: SmartAssistRequest
): Promise<SmartAssistResponse> {
  const response = await axios.post(`${API_URL}/smart-assist/`, data, {
    timeout: 30000,
  });
  return response.data;
}
