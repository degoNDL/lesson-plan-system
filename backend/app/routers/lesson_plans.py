from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from app.schemas.lesson_plan import LessonPlanSchema, LessonPlanUpdateSchema
from app.services import lesson_plan_service as service

bp = Blueprint("lesson_plans", __name__, url_prefix="/lesson-plans")

schema = LessonPlanSchema()
schema_many = LessonPlanSchema(many=True)
update_schema = LessonPlanUpdateSchema()


@bp.get("/")
def list_plans():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    titulo = request.args.get("titulo", "")
    disciplina = request.args.get("disciplina", "")
    tag = request.args.get("tag", "")
    data_prevista = request.args.get("data_prevista", "")
    order_by = request.args.get("order_by", "criado_em")

    result = service.get_all(
        page, per_page, titulo, disciplina, tag, data_prevista, order_by
    )

    return jsonify(
        {
            "items": schema_many.dump(result["items"]),
            "total": result["total"],
            "pages": result["pages"],
            "page": result["page"],
            "per_page": result["per_page"],
        }
    )


@bp.get("/<string:lesson_plan_id>")
def get_plan(lesson_plan_id):
    plan = service.get_by_id(lesson_plan_id)
    return jsonify(schema.dump(plan))


@bp.post("/")
def create_plan():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "Dados não fornecidos."}), 400

    try:
        data = schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 422

    plan = service.create(data)
    return jsonify(schema.dump(plan)), 201


@bp.put("/<string:lesson_plan_id>")
def update_plan(lesson_plan_id):
    json_data = request.get_json()
    if not json_data:
        return jsonify({"error": "Dados não fornecidos."}), 400

    try:
        data = update_schema.load(json_data)
    except ValidationError as err:
        return jsonify({"error": err.messages}), 422

    plan = service.update(lesson_plan_id, data)
    return jsonify(schema.dump(plan))


@bp.delete("/<string:lesson_plan_id>")
def delete_plan(lesson_plan_id):
    service.delete(lesson_plan_id)
    return "", 204
