class LessonPlanNotFoundError(Exception):
    """Plano de aula não encontrado"""

    pass


class SmartAssistError(Exception):
    """Erro na chamada à API de IA"""

    pass


class SmartAssistTimeoutError(Exception):
    """Timeout na chamada à API de IA"""

    pass


class SmartAssistRateLimitError(Exception):
    """Rate limit atingido na API de IA"""

    pass
