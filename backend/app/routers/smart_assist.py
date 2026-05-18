from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, validate, ValidationError

from app.services import smart_assist_service as service

bp = Blueprint("smart_assist", __name__, url_prefix="/smart-assist")


class SmartAssistRequestSchema(Schema):
    titulo = fields.Str(required=True, validate=validate.Length(min=3))
    disciplina = fields.Str(required=True, validate=validate.Length(min=2))
    ementa = fields.Str(required=True, validate=validate.Length(min=5))


request_schema = SmartAssistRequestSchema()


@bp.post("/")
def recommend():
    json_data = request.get_json(silent=True, force=True)
    if not json_data:
        return jsonify({"error": "Dados não fornecidos."}), 400

    try:
        data = request_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 422

    result = service.generate_recommendations(
        titulo=data["titulo"],
        disciplina=data["disciplina"],
        ementa=data["ementa"],
    )

    return jsonify(result), 200
