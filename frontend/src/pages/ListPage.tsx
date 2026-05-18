import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLessonPlans, deleteLessonPlan } from '../services/lessonPlanService';
import type { LessonPlan, PaginatedResponse } from '../types/lessonPlan';

export default function ListPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tag, setTag] = useState('');
  const [orderBy, setOrderBy] = useState<'titulo' | 'criado_em'>('criado_em');
  const [page, setPage] = useState(1);

  async function fetchPlans() {
    setLoading(true);
    setError(null);
    try {
      const result = await getLessonPlans({
        page,
        titulo,
        disciplina,
        tag,
        order_by: orderBy,
      });
      setData(result);
    } catch {
      setError('Erro ao carregar planos de aula.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [page, orderBy]);

  async function handleDelete(id: string) {
    if (!confirm('Deseja excluir este plano?')) return;
    await deleteLessonPlan(id);
    fetchPlans();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Planos de Aula
          </h1>
          <button
            onClick={() => navigate('/lesson-plans/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Novo Plano
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <input
            placeholder="Buscar por título..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Filtrar por disciplina..."
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Filtrar por tag..."
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
          <select
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as 'titulo' | 'criado_em')}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="criado_em">Ordenar por data</option>
            <option value="titulo">Ordenar por título</option>
          </select>
          <button
            onClick={() => { setPage(1); fetchPlans(); }}
            className="col-span-2 md:col-span-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            Buscar
          </button>
        </div>

        {/* Conteúdo */}
        {loading && <p className="text-gray-500">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && data && (
          <>
            <div className="bg-white rounded shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Título</th>
                    <th className="px-4 py-3 text-left">Disciplina</th>
                    <th className="px-4 py-3 text-left">Data Prevista</th>
                    <th className="px-4 py-3 text-left">Tags</th>
                    <th className="px-4 py-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                        Nenhum plano encontrado.
                      </td>
                    </tr>
                  )}
                  {data.items.map((plan: LessonPlan) => (
                    <tr key={plan.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{plan.titulo}</td>
                      <td className="px-4 py-3 text-gray-600">{plan.disciplina}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {plan.data_prevista ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {plan.tags ?? '—'}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => navigate(`/lesson-plans/${plan.id}/edit`)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>Total: {data.total} planos</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  {page} / {data.pages || 1}
                </span>
                <button
                  disabled={page >= (data.pages || 1)}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
