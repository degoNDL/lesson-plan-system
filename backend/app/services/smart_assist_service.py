import json
import logging
import time

from groq import Groq, RateLimitError, APITimeoutError, APIConnectionError

from app.config import Config
from app.exceptions import (
    SmartAssistError,
    SmartAssistRateLimitError,
    SmartAssistTimeoutError,
)

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Você é um Assistente Pedagógico especializado em planejamento de aulas.
Ao receber o título, disciplina e ementa de uma aula, retorne APENAS um JSON válido
com exatamente esta estrutura, sem texto adicional e sem markdown:
{
  "conteudos_complementares": ["conteúdo 1", "conteúdo 2", "conteúdo 3"],
  "topicos_relacionados": ["tópico 1", "tópico 2", "tópico 3"],
  "tags": ["tag1", "tag2", "tag3"]
}"""


def generate_recommendations(titulo: str, disciplina: str, ementa: str) -> dict:
    client = Groq(api_key=Config.GROQ_API_KEY)

    user_message = f"Título: {titulo}\nDisciplina: {disciplina}\nEmenta: {ementa}"

    start = time.time()

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            response_format={"type": "json_object"},
            timeout=30,
        )
    except RateLimitError:
        raise SmartAssistRateLimitError()
    except APITimeoutError:
        raise SmartAssistTimeoutError()
    except APIConnectionError:
        raise SmartAssistError("Erro de conexão com a API de IA.")
    except Exception as e:
        raise SmartAssistError(str(e))

    latency = round(time.time() - start, 2)
    usage = response.usage.total_tokens

    logger.info(
        f'[INFO] AI Request: Title="{titulo}", Discipline="{disciplina}", '
        f"TokenUsage={usage}, Latency={latency}s"
    )

    return json.loads(response.choices[0].message.content)
