from marshmallow import Schema, fields, validate


class LessonPlanSchema(Schema):
    id = fields.Str(dump_only=True)
    titulo = fields.Str(required=True, validate=validate.Length(min=3, max=255))
    objetivo = fields.Str(load_default=None, allow_none=True)
    ementa = fields.Str(required=True, validate=validate.Length(min=5))
    data_prevista = fields.Date(allow_none=True, load_default=None)
    disciplina = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    conteudos = fields.Str(allow_none=True, load_default=None)
    recursos_apoio = fields.Str(allow_none=True, load_default=None)
    tags = fields.Str(allow_none=True, load_default=None)
    criado_em = fields.DateTime(dump_only=True)
    atualizado_em = fields.DateTime(dump_only=True)


class LessonPlanUpdateSchema(Schema):
    titulo = fields.Str(validate=validate.Length(min=3, max=255))
    objetivo = fields.Str(validate=validate.Length(min=5))
    ementa = fields.Str(validate=validate.Length(min=5))
    data_prevista = fields.Date(allow_none=True)
    disciplina = fields.Str(validate=validate.Length(min=2, max=100))
    conteudos = fields.Str(allow_none=True)
    recursos_apoio = fields.Str(allow_none=True)
    tags = fields.Str(allow_none=True)
