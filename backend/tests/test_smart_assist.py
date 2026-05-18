from unittest.mock import patch


def test_smart_assist_sucesso(client):
    mock_response = {
        "conteudos_complementares": ["Conteúdo 1", "Conteúdo 2"],
        "topicos_relacionados": ["Tópico 1", "Tópico 2"],
        "tags": ["tag1", "tag2", "tag3"],
    }

    with patch(
        "app.services.smart_assist_service.generate_recommendations",
        return_value=mock_response,
    ):
        response = client.post(
            "/smart-assist/",
            json={
                "titulo": "Fotossíntese",
                "disciplina": "Biologia",
                "ementa": "Processo de conversão de luz em energia",
            },
        )

    assert response.status_code == 200
    data = response.get_json()
    assert "conteudos_complementares" in data
    assert "tags" in data
    assert "topicos_relacionados" in data


def test_smart_assist_campos_invalidos(client):
    response = client.post(
        "/smart-assist/",
        json={"titulo": "AB"},
    )
    assert response.status_code == 422


def test_smart_assist_sem_body(client):
    response = client.post("/smart-assist/")
    assert response.status_code == 400
