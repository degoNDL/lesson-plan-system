# Sistema de Gerenciamento de Planos de Aula

Plataforma centralizada para apoiar o planejamento pedagógico de docentes e conteudistas. O sistema permite o cadastro, organização e consulta de planos de aula, com uma funcionalidade de **Smart Assist** que utiliza Inteligência Artificial para sugerir conteúdos complementares, tópicos relacionados e tags com base no tema da aula.

---

## Proposta

O desafio consiste em desenvolver uma aplicação completa de gerenciamento de planos de aula que vá além de um simples CRUD — uma ferramenta inteligente que auxilia o docente no planejamento, sugerindo conteúdos automaticamente via LLM.

---

## Tecnologias Utilizadas

### Backend

- **Python 3.12** + **Flask** — API RESTful
- **SQLAlchemy** — ORM para comunicação com o banco de dados
- **Marshmallow** — validação e serialização de dados
- **SQLite** — banco de dados (zero configuração)
- **Groq API** (LLaMA 3.3-70b) — modelo de linguagem para o Smart Assist
- **pytest** + **pytest-cov** — testes automatizados com cobertura mínima de 70%
- **Ruff** + **Black** — linting e formatação de código

### Frontend

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS** — estilização
- **Axios** — requisições HTTP
- **React Router DOM** — navegação entre páginas

### DevOps

- **Docker** + **Docker Compose** — containerização
- **GitHub Actions** — CI/CD automatizado

---

## Funcionalidades

- Listagem de planos de aula com **paginação**, **filtros** (disciplina, tag, data prevista) e **busca por título**
- Ordenação por título ou data de cadastro
- Cadastro e edição de planos com validação de campos
- Exclusão com soft delete
- **Smart Assist** — botão que envia título, disciplina e ementa para a IA e preenche automaticamente os campos de conteúdos e tags
- Loading state e tratamento de erros na integração com a IA
- Logs estruturados nas operações principais e nas chamadas à IA
- Endpoint de health check (`GET /health`)

---

## Arquitetura

```
lesson-plan-system/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Application Factory
│   │   ├── config.py            # Configurações por ambiente
│   │   ├── extensions.py        # SQLAlchemy, CORS
│   │   ├── exceptions.py        # Exceções de domínio customizadas
│   │   ├── models/              # Models SQLAlchemy
│   │   ├── schemas/             # Schemas Marshmallow
│   │   ├── routers/             # Endpoints HTTP (thin layer)
│   │   └── services/            # Lógica de negócio e integração com IA
│   ├── tests/                   # Testes automatizados
│   └── run.py                   # Entrypoint da aplicação
├── frontend/
│   └── src/
│       ├── pages/               # ListPage e FormPage
│       ├── services/            # Chamadas à API
│       ├── types/               # Interfaces TypeScript
│       └── constants/           # URL base da API
├── docker-compose.yml
└── .github/workflows/           # Pipelines de CI
```

---

## Como Rodar

### Opção 1 — Docker (recomendado)

**Pré-requisitos:** Docker e Docker Compose instalados.

**1.** Clone o repositório:

```bash
git clone https://github.com/degoNDL/lesson-plan-system.git
cd lesson-plan-system
```

**2.** Crie o arquivo `.env` na raiz com sua chave do Groq:

```bash
GROQ_API_KEY=sua_chave_aqui
```

> Crie sua chave gratuitamente em [console.groq.com](https://console.groq.com)

**3.** Suba a aplicação:

```bash
docker-compose up --build
```

**4.** Acesse:

- Frontend → http://localhost:5173
- Backend → http://localhost:5000
- Health check → http://localhost:5000/health

---

### Opção 2 — Localmente (sem Docker)

**Pré-requisitos:** Python 3.12+ e Node 20+

**Backend:**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
```

Crie o arquivo `backend/.env`:

```
GROQ_API_KEY=sua_chave_aqui
DATABASE_URL=sqlite:///./app.db
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key
```

```bash
flask run
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Crie o arquivo `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

---

## Testes

```bash
cd backend
venv\Scripts\activate
pytest --cov=app --cov-report=term-missing
```

Cobertura atual: **87%** (mínimo exigido: 70%)

---

## CI/CD com GitHub Actions

O repositório possui dois pipelines configurados:

### Backend CI

Roda a cada push nas branches `main` e `dev`:

1. **Lint e Formatação** — verifica o código com Ruff e Black
2. **Testes e Cobertura** — executa o pytest e exige cobertura mínima de 70%

Os testes rodam com banco SQLite em memória e variáveis de ambiente mockadas — sem necessidade de configuração externa.

### Frontend CI

1. **ESLint** — verificação de qualidade do código
2. **TypeScript** — checagem de tipos

### Branch Protection

A branch `main` está protegida — só aceita código via Pull Request com todos os checks do CI aprovados.

---

## Smart Assist — Como Funciona

1. No formulário, preencha **Título**, **Disciplina** e **Ementa**
2. Clique em **"Gerar Recomendações com IA"**
3. O frontend envia os dados para `POST /smart-assist/`
4. O backend consulta a API do Groq (LLaMA 3.3-70b) com um prompt estruturado
5. A IA retorna um JSON com conteúdos complementares, tópicos relacionados e 3 tags
6. O frontend preenche automaticamente os campos correspondentes

**Exemplo de log gerado:**

```
[INFO] AI Request: Title="Fotossíntese", Discipline="Biologia", TokenUsage=180, Latency=1.4s
```

---

## Estratégia de Desenvolvimento

O projeto foi desenvolvido com uma estratégia de branches por funcionalidade, garantindo que cada entrega fosse isolada, testável e integrada de forma controlada.

### Fluxo adotado

```
feature/xxx  →  dev  →  main
```

Cada feature branch foi desenvolvida de forma independente, mergeada na `dev` para integração, e ao final de cada ciclo maior, a `dev` foi mergeada na `main` via Pull Request — exigindo aprovação do CI.

### Branches e o que cada uma entregou

| Branch                      | Entrega principal                                                                                                                 |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `feature/project-setup`     | Estrutura inicial de pastas, `.gitignore`, arquivos `.env.example`, `requirements.txt` e configuração dos workflows de CI         |
| `feature/backend-structure` | Application Factory Flask, configuração por ambiente (`config.py`), extensões SQLAlchemy e CORS, exceções de domínio customizadas |
| `feature/lesson-plan-model` | Model SQLAlchemy com todos os campos do desafio e schemas Marshmallow para validação e serialização                               |
| `feature/crud-endpoints`    | Endpoints completos: listagem com paginação e filtros, cadastro, edição e exclusão com soft delete                                |
| `feature/smart-assist`      | Integração com a API do Groq (LLaMA 3.3-70b), prompt engineering para o Assistente Pedagógico e logs estruturados                 |
| `feature/backend-tests`     | 12 testes automatizados cobrindo CRUD e Smart Assist, atingindo 87% de cobertura                                                  |
| `feature/frontend-setup`    | Projeto React + Vite + TypeScript + Tailwind CSS, serviços de API, tipos e roteamento                                             |
| `feature/docker`            | Dockerfiles para backend e frontend, `docker-compose.yml` para execução com um único comando                                      |

### Por que essa estratégia?

A separação por branches trouxe dois benefícios principais: **organização** : cada parte do sistema foi desenvolvida e validada de forma independente antes de ser integrada e **agilidade** : o CI rodava em cada branch, garantindo que problemas fossem identificados cedo, sem comprometer o restante do desenvolvimento.

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável       | Descrição                             |
| -------------- | ------------------------------------- |
| `GROQ_API_KEY` | Chave da API do Groq                  |
| `DATABASE_URL` | URL do banco (padrão: SQLite)         |
| `FLASK_APP`    | Entrypoint do Flask                   |
| `FLASK_ENV`    | Ambiente (`development` ou `testing`) |
| `SECRET_KEY`   | Chave secreta da aplicação            |

### Frontend (`frontend/.env`)

| Variável       | Descrição           |
| -------------- | ------------------- |
| `VITE_API_URL` | URL base do backend |

---

## Endpoints da API

| Método | Endpoint             | Descrição                          |
| ------ | -------------------- | ---------------------------------- |
| GET    | `/health`            | Health check                       |
| GET    | `/lesson-plans/`     | Listar planos (paginado + filtros) |
| GET    | `/lesson-plans/<id>` | Buscar plano por ID                |
| POST   | `/lesson-plans/`     | Criar plano                        |
| PUT    | `/lesson-plans/<id>` | Editar plano                       |
| DELETE | `/lesson-plans/<id>` | Excluir plano (soft delete)        |
| POST   | `/smart-assist/`     | Gerar recomendações com IA         |

---

## Considerações Finais

Este projeto foi desenvolvido de forma **individual**, em um **curto período de tempo**, com o uso auxiliar de ferramentas de IA — **Claude Sonnet 4.6** e **Gemini 2.0 Flash-Lite** — como apoio no desenvolvimento.

Dado o prazo reduzido, a prioridade foi garantir o **funcionamento correto das funcionalidades principais**: CRUD completo, Smart Assist com integração real a um LLM, testes automatizados, CI/CD e containerização. A interface foi construída de forma funcional e objetiva, sem investimento aprofundado em design ou experiência visual — uma escolha deliberada para viabilizar a entrega dentro do tempo disponível.

A base construída é sólida e preparada para evoluir. Há espaço claro para expansões futuras, entre elas:

- **Migração do banco de dados** para PostgreSQL ou outro banco relacional mais robusto, abrindo caminho para funcionalidades mais complexas
- **Design mais moderno e responsivo**, com componentização mais refinada e experiência de usuário aprimorada
- **Novas funcionalidades pedagógicas**, como compartilhamento de planos, controle de versões, histórico de edições e colaboração entre docentes
- **Autenticação e controle de acesso**, com perfis de usuário e permissões por papel
- **Expansão do Smart Assist**, com geração automática de avaliações, sugestões de recursos didáticos e análise de progressão curricular
