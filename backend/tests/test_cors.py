"""Tests for CORS configuration on the FastAPI backend.

Verifies:
- Reproduction of the reported DevTools symptom (missing Allow-Origin with Allow-Credentials).
- Exact Vercel origin for both GET and OPTIONS requests.
- Trailing slash tolerance on origin headers.
- Vercel branch/preview subdomains without using broad wildcards.
- Preserved localhost development origins.
- Rejection of unauthorized external origins.
"""

from starlette.middleware.cors import CORSMiddleware
from starlette.testclient import TestClient


def test_cors_reproduce_reported_behavior_on_unrecognized_origin(client) -> None:
    """Reproduces the exact Chrome DevTools report:

    When an origin is not recognized:
    - GET returns 200 OK.
    - Access-Control-Allow-Credentials: true is returned.
    - Access-Control-Allow-Origin is MISSING (triggering the browser CORS block).
    - OPTIONS preflight returns 400 Bad Request with 'Disallowed CORS origin'.
    """
    unrecognized_origin = "https://unauthorized-domain.com"

    # GET request symptom
    res_get = client.get("/api/v1/employees", headers={"Origin": unrecognized_origin})
    assert res_get.status_code == 200
    assert res_get.headers.get("access-control-allow-credentials") == "true"
    assert "access-control-allow-origin" not in res_get.headers

    # OPTIONS preflight symptom
    res_opt = client.options(
        "/api/v1/employees",
        headers={
            "Origin": unrecognized_origin,
            "Access-Control-Request-Method": "GET",
        },
    )
    assert res_opt.status_code == 400
    assert "Disallowed CORS origin" in res_opt.text


def test_cors_exact_vercel_origin_get(client) -> None:
    """Verifies that the exact deployed Vercel frontend origin receives Access-Control-Allow-Origin on GET."""
    origin = "https://hrms-trailblazex.vercel.app"
    response = client.get(
        "/api/v1/employees",
        headers={"Origin": origin},
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
    assert response.headers.get("access-control-allow-credentials") == "true"
    assert "Origin" in response.headers.get("vary", "")


def test_cors_exact_vercel_origin_options(client) -> None:
    """Verifies preflight OPTIONS response for the exact deployed Vercel origin."""
    origin = "https://hrms-trailblazex.vercel.app"
    response = client.options(
        "/api/v1/employees",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization,content-type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin
    assert response.headers.get("access-control-allow-credentials") == "true"
    allowed_methods = response.headers.get("access-control-allow-methods", "")
    for method in ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]:
        assert method in allowed_methods


def test_cors_vercel_trailing_slash_tolerance(client) -> None:
    """Verifies origin with trailing slash is properly allowed."""
    origin = "https://hrms-trailblazex.vercel.app/"
    response_get = client.get("/api/v1/employees", headers={"Origin": origin})
    assert response_get.status_code == 200
    assert response_get.headers.get("access-control-allow-origin") == origin

    response_opt = client.options(
        "/api/v1/employees",
        headers={"Origin": origin, "Access-Control-Request-Method": "POST"},
    )
    assert response_opt.status_code == 200
    assert response_opt.headers.get("access-control-allow-origin") == origin


def test_cors_vercel_preview_subdomain(client) -> None:
    """Verifies Vercel preview/branch deployments (e.g. git branches) are allowed safely without broad wildcards."""
    origin = "https://hrms-trailblazex-git-main-harsh98934.vercel.app"
    response = client.get("/api/v1/employees", headers={"Origin": origin})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == origin


def test_cors_localhost_origins_preserved(client) -> None:
    """Verifies all existing local development origins remain allowed."""
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
    """Verifies arbitrary third-party origins are rejected."""
    for bad_origin in [
        "https://malicious-site.com",
        "https://another-hrms.vercel.app",
        "http://localhost:3000",
    ]:
        response = client.get("/health", headers={"Origin": bad_origin})
        assert response.status_code == 200
        assert "access-control-allow-origin" not in response.headers
