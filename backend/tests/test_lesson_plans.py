import json


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"


def test_list_plans_vazio(client):
    response = client.get("/lesson-plans/")
    assert response.status_code == 200
    data = response.get_json()
    assert data["items"] == []
    assert data["total"] == 0


def test_create_plan(client):
    payload = {
        "titulo": "Introdução ao Python",
        "objetivo": "Ensinar os fundamentos da linguagem Python",
        "ementa": "Variáveis, tipos de dados, estruturas de controle",
        "disciplina": "Programação",
        "data_prevista": "2026-06-01",
        "tags": "python,programacao,iniciante",
    }
    response = client.post(
        "/lesson-plans/",
        data=json.dumps(payload),
        content_type="application/json",
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data["titulo"] == "Introdução ao Python"
    assert data["disciplina"] == "Programação"
    assert "id" in data


def test_get_plan(client):
    payload = {
        "titulo": "Álgebra Linear",
        "objetivo": "Ensinar vetores e matrizes",
        "ementa": "Vetores, matrizes, determinantes",
        "disciplina": "Matemática",
    }
    create = client.post(
        "/lesson-plans/",
        data=json.dumps(payload),
        content_type="application/json",
    )
    plan_id = create.get_json()["id"]

    response = client.get(f"/lesson-plans/{plan_id}")
    assert response.status_code == 200
    assert response.get_json()["id"] == plan_id


def test_update_plan(client):
    payload = {
        "titulo": "Redes de Computadores",
        "objetivo": "Ensinar fundamentos de redes",
        "ementa": "Modelo OSI, TCP/IP, protocolos",
        "disciplina": "Redes",
    }
    create = client.post(
        "/lesson-plans/",
        data=json.dumps(payload),
        content_type="application/json",
    )
    plan_id = create.get_json()["id"]

    update = client.put(
        f"/lesson-plans/{plan_id}",
        data=json.dumps({"titulo": "Redes Avançadas"}),
        content_type="application/json",
    )
    assert update.status_code == 200
    assert update.get_json()["titulo"] == "Redes Avançadas"


def test_delete_plan(client):
    payload = {
        "titulo": "Banco de Dados",
        "objetivo": "Ensinar SQL e modelagem",
        "ementa": "SQL, normalização, índices",
        "disciplina": "Banco de Dados",
    }
    create = client.post(
        "/lesson-plans/",
        data=json.dumps(payload),
        content_type="application/json",
    )
    plan_id = create.get_json()["id"]

    delete = client.delete(f"/lesson-plans/{plan_id}")
    assert delete.status_code == 204

    get = client.get(f"/lesson-plans/{plan_id}")
    assert get.status_code == 404


def test_create_plan_invalido(client):
    payload = {
        "titulo": "AB",
        "objetivo": "Objetivo",
        "ementa": "Ementa",
        "disciplina": "Matéria",
    }
    response = client.post(
        "/lesson-plans/",
        data=json.dumps(payload),
        content_type="application/json",
    )
    assert response.status_code == 422


def test_get_plan_nao_encontrado(client):
    response = client.get("/lesson-plans/id-inexistente")
    assert response.status_code == 404


def test_filtro_por_disciplina(client):
    for titulo, disciplina in [
        ("Aula de Python", "Programação"),
        ("Aula de História", "História"),
    ]:
        client.post(
            "/lesson-plans/",
            data=json.dumps(
                {
                    "titulo": titulo,
                    "objetivo": "Objetivo teste",
                    "ementa": "Ementa teste",
                    "disciplina": disciplina,
                }
            ),
            content_type="application/json",
        )

    response = client.get("/lesson-plans/?disciplina=Programação")
    data = response.get_json()
    assert data["total"] == 1
    assert data["items"][0]["disciplina"] == "Programação"
