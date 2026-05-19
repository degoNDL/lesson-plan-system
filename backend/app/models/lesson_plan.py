import uuid
from datetime import datetime
from app.extensions import db


class LessonPlan(db.Model):
    __tablename__ = "lesson_plans"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    titulo = db.Column(db.String(255), nullable=False)
    objetivo = db.Column(db.Text, nullable=True)
    ementa = db.Column(db.Text, nullable=False)
    data_prevista = db.Column(db.Date, nullable=True)
    disciplina = db.Column(db.String(100), nullable=False)
    conteudos = db.Column(db.Text, nullable=True)
    recursos_apoio = db.Column(db.Text, nullable=True)
    tags = db.Column(db.String(500), nullable=True)
    criado_em = db.Column(db.DateTime, default=datetime.utcnow)
    atualizado_em = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
    deleted_at = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<LessonPlan {self.titulo}>"
