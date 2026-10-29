"""Tests for CORS configuration on the FastAPI backend."""


def test_cors_vercel_origin_allowed(client) -> None:
    origin = "https://hrms-trailblazex.vercel.app"
    response = client.get(
        "/api/v1/employees",
        headers={"Origin": origin},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_preflight_options(client) -> None:
    origin = "https://hrms-trailblazex.vercel.app"
    response = client.options(
        "/api/v1/employees",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type,authorization",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
    assert response.headers.get("access-control-allow-credentials") == "true"
    allowed_methods = response.headers.get("access-control-allow-methods", "")
    for method in ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]:
        assert method in allowed_methods


def test_cors_localhost_origins_preserved(client) -> None:
    for origin in [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
    ]:
        response = client.get("/health", headers={"Origin": origin})
        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == origin


def test_cors_disallowed_origin_rejected(client) -> None:
    response = client.get(
        "/health",
        headers={"Origin": "https://unauthorized-domain.com"},
    )
    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers