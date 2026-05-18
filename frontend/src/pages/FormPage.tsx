import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createLessonPlan,
  updateLessonPlan,
  getLessonPlanById,
} from '../services/lessonPlanService';
import { getRecommendations } from '../services/smartAssistService';
import type { LessonPlan } from '../types/lessonPlan';

interface FormData {
  titulo: string;
  objetivo: string;
  ementa: string;
  data_prevista: string;
  disciplina: string;
  conteudos: string;
  recursos_apoio: string;
  tags: string;
}

const emptyForm: FormData = {
  titulo: '',
  objetivo: '',
  ementa: '',
  data_prevista: '',
  disciplina: '',
  conteudos: '',
  recursos_apoio: '',
  tags: '',
};

export default function FormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      getLessonPlanById(id).then((plan: LessonPlan) => {
        setForm({
          titulo: plan.titulo,
          objetivo: plan.objetivo,
          ementa: plan.ementa,
          data_prevista: plan.data_prevista ?? '',
          disciplina: plan.disciplina,
          conteudos: plan.conteudos ?? '',
          recursos_apoio: plan.recursos_apoio ?? '',
          tags: plan.tags ?? '',
        });
      });
    }
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSmartAssist() {
    if (!form.titulo || !form.disciplina || !form.ementa) {
      setAiError('Preencha Título, Disciplina e Ementa antes de usar o Smart Assist.');
      return;
    }

    setLoadingAI(true);
    setAiError(null);

    try {
      const result = await getRecommendations({
        titulo: form.titulo,
        disciplina: form.disciplina,
        ementa: form.ementa,
      });

      setForm((prev) => ({
        ...prev,
        conteudos: result.conteudos_complementares.join('\n'),
        tags: result.tags.join(', '),
      }));
    } catch {
      setAiError('Erro ao consultar a IA. Verifique se o backend está rodando e tente novamente.');
    } finally {
      setLoadingAI(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        data_prevista: form.data_prevista || null,
        conteudos: form.conteudos || null,
        recursos_apoio: form.recursos_apoio || null,
        tags: form.tags || null,
      };

      if (isEditing && id) {
        await updateLessonPlan(id, payload);
      } else {
        await createLessonPlan(payload);
      }

      setSuccess(true);
      setTimeout(() => navigate('/lesson-plans'), 1000);
    } catch {
      setError('Erro ao salvar o plano. Verifique os campos e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/lesson-plans')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Editar Plano' : 'Novo Plano de Aula'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4">

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título da Aula *
            </label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Introdução ao Python"
            />
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disciplina *
            </label>
            <input
              name="disciplina"
              value={form.disciplina}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Programação"
            />
          </div>

          {/* Ementa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ementa / Resumo *
            </label>
            <textarea
              name="ementa"
              value={form.ementa}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva brevemente o conteúdo da aula..."
            />
          </div>

          {/* Botão Smart Assist */}
          <div className="border border-purple-200 bg-purple-50 rounded p-4">
            <p className="text-sm text-purple-700 mb-2 font-medium">
              Smart Assist — Preencha Título, Disciplina e Ementa acima e clique para gerar sugestões com IA
            </p>
            <button
              type="button"
              onClick={handleSmartAssist}
              disabled={loadingAI}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm font-medium w-full"
            >
              {loadingAI ? 'Gerando recomendações...' : 'Gerar Recomendações com IA'}
            </button>
            {aiError && (
              <p className="text-red-500 text-xs mt-2">{aiError}</p>
            )}
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Objetivo *
            </label>
            <textarea
              name="objetivo"
              value={form.objetivo}
              onChange={handleChange}
              required
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="O que o aluno vai aprender?"
            />
          </div>

          {/* Conteúdos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Conteúdos
              <span className="text-purple-600 text-xs ml-1">(preenchido pelo Smart Assist)</span>
            </label>
            <textarea
              name="conteudos"
              value={form.conteudos}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Conteúdos complementares..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
              <span className="text-purple-600 text-xs ml-1">(preenchido pelo Smart Assist)</span>
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: python, programação, iniciante"
            />
          </div>

          {/* Data Prevista */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Prevista
            </label>
            <input
              type="date"
              name="data_prevista"
              value={form.data_prevista}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Recursos de Apoio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recursos de Apoio
            </label>
            <textarea
              name="recursos_apoio"
              value={form.recursos_apoio}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: slides, vídeos, apostilas..."
            />
          </div>

          {/* Feedback */}
          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm bg-green-50 p-3 rounded">
              ✅ Plano salvo com sucesso! Redirecionando...
            </p>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/lesson-plans')}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Plano'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
