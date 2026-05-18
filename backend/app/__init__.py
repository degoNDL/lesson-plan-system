import logging
from flask import Flask, jsonify
from app.config import config
from app.extensions import db
from app.exceptions import (
    LessonPlanNotFoundError,
    SmartAssistError,
    SmartAssistTimeoutError,
    SmartAssistRateLimitError,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


def create_app(config_name=None):
    import os

    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config["default"]))

    db.init_app(app)

    with app.app_context():
        db.create_all()

    # from app.routers.lesson_plans import bp as plans_bp
    # app.register_blueprint(plans_bp)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(LessonPlanNotFoundError)
    def handle_not_found(e):
        return jsonify({"error": str(e) or "Plano de aula não encontrado"}), 404

    @app.errorhandler(SmartAssistRateLimitError)
    def handle_rate_limit(e):
        return jsonify({"error": "Limite da API de IA atingido. Tente novamente."}), 429

    @app.errorhandler(SmartAssistTimeoutError)
    def handle_timeout(e):
        return jsonify({"error": "A IA demorou para responder. Tente novamente."}), 504

    @app.errorhandler(SmartAssistError)
    def handle_ai_error(e):
        return jsonify({"error": "Erro ao consultar a IA."}), 502

    return app
