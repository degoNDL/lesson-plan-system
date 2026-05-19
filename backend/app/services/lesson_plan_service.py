from datetime import datetime
from app.extensions import db
from app.models.lesson_plan import LessonPlan
from app.exceptions import LessonPlanNotFoundError


def get_all(page, per_page, titulo, disciplina, tag, data_prevista, order_by):
    query = LessonPlan.query.filter(LessonPlan.deleted_at.is_(None))

    if titulo:
        query = query.filter(LessonPlan.titulo.ilike(f"%{titulo}%"))
    if disciplina:
        query = query.filter(LessonPlan.disciplina.ilike(f"%{disciplina}%"))
    if tag:
        query = query.filter(LessonPlan.tags.ilike(f"%{tag}%"))
    if data_prevista:
        query = query.filter(LessonPlan.data_prevista == data_prevista)

    if order_by == "titulo":
        query = query.order_by(LessonPlan.titulo.asc())
    else:
        query = query.order_by(LessonPlan.criado_em.desc())

    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return {
        "items": paginated.items,
        "total": paginated.total,
        "pages": paginated.pages,
        "page": page,
        "per_page": per_page,
    }


def get_by_id(lesson_plan_id):
    plan = LessonPlan.query.filter_by(id=lesson_plan_id, deleted_at=None).first()
    if not plan:
        raise LessonPlanNotFoundError("Plano de aula não encontrado.")
    return plan


def create(data):
    plan = LessonPlan(**data)
    db.session.add(plan)
    db.session.commit()
    return plan


def update(lesson_plan_id, data):
    plan = get_by_id(lesson_plan_id)
    for key, value in data.items():
        setattr(plan, key, value)
    plan.atualizado_em = datetime.utcnow()
    db.session.commit()
    return plan


def delete(lesson_plan_id):
    plan = get_by_id(lesson_plan_id)
    plan.deleted_at = datetime.utcnow()
    db.session.commit()


def get_meta():
    rows = (
        db.session.query(LessonPlan.titulo, LessonPlan.disciplina, LessonPlan.tags)
        .filter(LessonPlan.deleted_at.is_(None))
        .all()
    )

    titulos = sorted({r.titulo for r in rows if r.titulo})
    disciplinas = sorted({r.disciplina for r in rows if r.disciplina})

    tags = set()
    for r in rows:
        if r.tags:
            for t in r.tags.split(","):
                t = t.strip()
                if t:
                    tags.add(t)

    return {"titulos": titulos, "disciplinas": disciplinas, "tags": sorted(tags)}
