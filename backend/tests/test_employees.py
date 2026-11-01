EMPLOYEE = {
    "full_name": "Ada Lovelace",
    "email": "ada@trailblazex.com",
    "department": "Engineering",
    "job_title": "Software Engineer",
    "salary": "120000.00",
    "joining_date": "2026-01-10",
}


def test_create_and_get_employee(client) -> None:
    created = client.post("/api/v1/employees", json=EMPLOYEE)
    assert created.status_code == 201
    body = created.json()
    assert body["full_name"] == "Ada Lovelace"
    assert body["salary"] == "120000.00"
    assert body["status"] == "active"
    employee_id = body["id"]

    fetched = client.get(f"/api/v1/employees/{employee_id}")
    assert fetched.status_code == 200
    assert fetched.json()["email"] == "ada@trailblazex.com"
    assert fetched.json()["status"] == "active"

    listed = client.get("/api/v1/employees")
    assert listed.status_code == 200
    assert len(listed.json()) == 1


def test_duplicate_email_conflict(client) -> None:
    assert client.post("/api/v1/employees", json=EMPLOYEE).status_code == 201
    duplicate = client.post("/api/v1/employees", json=EMPLOYEE)
    assert duplicate.status_code == 409


def test_delete_employee(client) -> None:
    employee_id = client.post("/api/v1/employees", json=EMPLOYEE).json()["id"]
    deleted = client.delete(f"/api/v1/employees/{employee_id}")
    assert deleted.status_code == 204
    assert client.get(f"/api/v1/employees/{employee_id}").status_code == 404


def test_update_employee_full(client) -> None:
    emp = client.post("/api/v1/employees", json=EMPLOYEE).json()
    emp_id = emp["id"]

    update_payload = {
        "full_name": "Ada Lovelace King",
        "email": "ada.king@trailblazex.com",
        "department": "Advanced Research",
        "job_title": "Principal Computing Pioneer",
        "salary": "165000.00",
        "joining_date": "2026-02-15",
        "status": "inactive",
    }
    res = client.put(f"/api/v1/employees/{emp_id}", json=update_payload)
    assert res.status_code == 200
    body = res.json()
    assert body["id"] == emp_id
    assert body["full_name"] == "Ada Lovelace King"
    assert body["email"] == "ada.king@trailblazex.com"
    assert body["department"] == "Advanced Research"
    assert body["job_title"] == "Principal Computing Pioneer"
    assert body["salary"] == "165000.00"
    assert body["joining_date"] == "2026-02-15"
    assert body["status"] == "inactive"

    # Verify persistence via GET
    fetched = client.get(f"/api/v1/employees/{emp_id}")
    assert fetched.status_code == 200
    assert fetched.json() == body


def test_update_employee_partial_patch(client) -> None:
    emp = client.post("/api/v1/employees", json=EMPLOYEE).json()
    emp_id = emp["id"]

    # Partial update: change only status and salary
    res = client.patch(
        f"/api/v1/employees/{emp_id}",
        json={"status": "inactive", "salary": "135000.00"},
    )
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "inactive"
    assert body["salary"] == "135000.00"
    assert body["full_name"] == "Ada Lovelace"
    assert body["department"] == "Engineering"


def test_update_employee_name_alias(client) -> None:
    emp = client.post("/api/v1/employees", json=EMPLOYEE).json()
    emp_id = emp["id"]

    # Frontend may pass "name" instead of "full_name"
    res = client.put(f"/api/v1/employees/{emp_id}", json={"name": "Ada Byron"})
    assert res.status_code == 200
    assert res.json()["full_name"] == "Ada Byron"


def test_update_employee_not_found(client) -> None:
    res = client.put("/api/v1/employees/99999", json={"job_title": "Ghost"})
    assert res.status_code == 404
    assert res.json()["detail"] == "Employee not found."

    res_patch = client.patch("/api/v1/employees/99999", json={"status": "inactive"})
    assert res_patch.status_code == 404


def test_update_employee_invalid_inputs(client) -> None:
    emp = client.post("/api/v1/employees", json=EMPLOYEE).json()
    emp_id = emp["id"]

    # Invalid salary (zero or negative)
    assert client.put(f"/api/v1/employees/{emp_id}", json={"salary": "0.00"}).status_code == 422
    assert client.put(f"/api/v1/employees/{emp_id}", json={"salary": "-500.00"}).status_code == 422

    # Invalid email format
    assert client.put(f"/api/v1/employees/{emp_id}", json={"email": "invalid-email"}).status_code == 422

    # Invalid status enum
    assert client.put(f"/api/v1/employees/{emp_id}", json={"status": "suspended"}).status_code == 422

    # Empty string for required string fields
    assert client.put(f"/api/v1/employees/{emp_id}", json={"department": ""}).status_code == 422
    assert client.put(f"/api/v1/employees/{emp_id}", json={"job_title": ""}).status_code == 422
    assert client.put(f"/api/v1/employees/{emp_id}", json={"full_name": ""}).status_code == 422


def test_update_employee_duplicate_email(client) -> None:
    client.post("/api/v1/employees", json=EMPLOYEE)
    second_emp = client.post(
        "/api/v1/employees",
        json={
            "full_name": "Charles Babbage",
            "email": "charles@trailblazex.com",
            "department": "Engineering",
            "job_title": "Computer Pioneer",
            "salary": "110000.00",
            "joining_date": "2026-01-11",
        },
    ).json()

    # Updating Charles's email to Ada's should raise 409 Conflict
    res = client.put(
        f"/api/v1/employees/{second_emp['id']}",
        json={"email": "ada@trailblazex.com"},
    )
    assert res.status_code == 409
    assert "email already exists" in res.json()["detail"]


def test_init_db_raises_on_migration_failure():
    from unittest.mock import MagicMock, patch
    import pytest
    from sqlalchemy.exc import OperationalError
    from app.database import init_db

    mock_conn = MagicMock()
    mock_conn.execute.side_effect = OperationalError("statement", {}, Exception("Database locked"))

    with patch("app.database.DATABASE_URL", "postgresql://localhost/fake"):
        with patch("app.database.Base.metadata.create_all"):
            with patch("app.database.engine.begin") as mock_begin:
                mock_begin.return_value.__enter__.return_value = mock_conn
                with pytest.raises(RuntimeError, match="Database migration failed"):
                    init_db()
