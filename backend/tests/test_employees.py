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
    employee_id = body["id"]

    fetched = client.get(f"/api/v1/employees/{employee_id}")
    assert fetched.status_code == 200
    assert fetched.json()["email"] == "ada@trailblazex.com"

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
