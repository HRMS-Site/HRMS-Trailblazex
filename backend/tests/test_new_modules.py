"""Tests for the five new HRMS API modules: departments, payroll, attendance, leave, budgets."""

# ---------------------------------------------------------------------------
# Departments
# ---------------------------------------------------------------------------

DEPT = {"name": "Engineering", "code": "ENG", "manager_name": "Alice Smith"}
DEPT2 = {"name": "Finance", "code": "FIN", "manager_name": "Bob Jones"}


def test_department_crud(client) -> None:
    # Create
    res = client.post("/api/v1/departments", json=DEPT)
    assert res.status_code == 201
    body = res.json()
    assert body["name"] == "Engineering"
    assert body["code"] == "ENG"
    dept_id = body["id"]

    # Get single
    res = client.get(f"/api/v1/departments/{dept_id}")
    assert res.status_code == 200
    assert res.json()["manager_name"] == "Alice Smith"

    # List
    client.post("/api/v1/departments", json=DEPT2)
    res = client.get("/api/v1/departments")
    assert res.status_code == 200
    assert len(res.json()) == 2

    # Update
    updated = {**DEPT, "manager_name": "Carol White"}
    res = client.put(f"/api/v1/departments/{dept_id}", json=updated)
    assert res.status_code == 200
    assert res.json()["manager_name"] == "Carol White"

    # Delete
    res = client.delete(f"/api/v1/departments/{dept_id}")
    assert res.status_code == 204
    assert client.get(f"/api/v1/departments/{dept_id}").status_code == 404


def test_department_duplicate_code(client) -> None:
    client.post("/api/v1/departments", json=DEPT)
    res = client.post("/api/v1/departments", json=DEPT)
    assert res.status_code == 409


def test_department_not_found(client) -> None:
    assert client.get("/api/v1/departments/999").status_code == 404
    assert client.put("/api/v1/departments/999", json=DEPT).status_code == 404
    assert client.delete("/api/v1/departments/999").status_code == 404


# ---------------------------------------------------------------------------
# Payroll
# ---------------------------------------------------------------------------

PAYROLL = {
    "employee_name": "Ada Lovelace",
    "period_start": "2026-01-01",
    "period_end": "2026-01-31",
    "gross_pay": "5000.00",
    "deductions": "500.00",
    "net_pay": "4500.00",
    "status": "draft",
}


def test_payroll_crud(client) -> None:
    # Create
    res = client.post("/api/v1/payroll", json=PAYROLL)
    assert res.status_code == 201
    body = res.json()
    assert body["employee_name"] == "Ada Lovelace"
    assert body["gross_pay"] == "5000.00"
    assert body["status"] == "draft"
    record_id = body["id"]

    # Get single
    res = client.get(f"/api/v1/payroll/{record_id}")
    assert res.status_code == 200

    # List
    res = client.get("/api/v1/payroll")
    assert res.status_code == 200
    assert len(res.json()) == 1

    # Update (promote status)
    updated = {**PAYROLL, "status": "processed"}
    res = client.put(f"/api/v1/payroll/{record_id}", json=updated)
    assert res.status_code == 200
    assert res.json()["status"] == "processed"

    # Delete
    res = client.delete(f"/api/v1/payroll/{record_id}")
    assert res.status_code == 204
    assert client.get(f"/api/v1/payroll/{record_id}").status_code == 404


def test_payroll_not_found(client) -> None:
    assert client.get("/api/v1/payroll/999").status_code == 404
    assert client.put("/api/v1/payroll/999", json=PAYROLL).status_code == 404
    assert client.delete("/api/v1/payroll/999").status_code == 404


# ---------------------------------------------------------------------------
# Attendance
# ---------------------------------------------------------------------------

ATTENDANCE = {
    "employee_name": "Grace Hopper",
    "date": "2026-06-15",
    "status": "present",
    "check_in": "09:00",
    "check_out": "18:00",
}


def test_attendance_crud(client) -> None:
    res = client.post("/api/v1/attendance", json=ATTENDANCE)
    assert res.status_code == 201
    body = res.json()
    assert body["employee_name"] == "Grace Hopper"
    assert body["status"] == "present"
    assert body["check_in"] == "09:00"
    record_id = body["id"]

    res = client.get(f"/api/v1/attendance/{record_id}")
    assert res.status_code == 200

    res = client.get("/api/v1/attendance")
    assert res.status_code == 200
    assert len(res.json()) == 1

    updated = {**ATTENDANCE, "status": "remote", "check_in": "10:00"}
    res = client.put(f"/api/v1/attendance/{record_id}", json=updated)
    assert res.status_code == 200
    assert res.json()["status"] == "remote"
    assert res.json()["check_in"] == "10:00"

    res = client.delete(f"/api/v1/attendance/{record_id}")
    assert res.status_code == 204
    assert client.get(f"/api/v1/attendance/{record_id}").status_code == 404


def test_attendance_not_found(client) -> None:
    assert client.get("/api/v1/attendance/999").status_code == 404
    assert client.put("/api/v1/attendance/999", json=ATTENDANCE).status_code == 404
    assert client.delete("/api/v1/attendance/999").status_code == 404


# ---------------------------------------------------------------------------
# Leave
# ---------------------------------------------------------------------------

LEAVE = {
    "employee_name": "Charles Babbage",
    "leave_type": "Annual",
    "start_date": "2026-07-10",
    "end_date": "2026-07-14",
    "status": "pending",
    "reason": "Family vacation",
}


def test_leave_crud(client) -> None:
    res = client.post("/api/v1/leave", json=LEAVE)
    assert res.status_code == 201
    body = res.json()
    assert body["employee_name"] == "Charles Babbage"
    assert body["status"] == "pending"
    assert body["leave_type"] == "Annual"
    record_id = body["id"]

    res = client.get(f"/api/v1/leave/{record_id}")
    assert res.status_code == 200

    res = client.get("/api/v1/leave")
    assert res.status_code == 200
    assert len(res.json()) == 1

    updated = {**LEAVE, "status": "approved"}
    res = client.put(f"/api/v1/leave/{record_id}", json=updated)
    assert res.status_code == 200
    assert res.json()["status"] == "approved"

    res = client.delete(f"/api/v1/leave/{record_id}")
    assert res.status_code == 204
    assert client.get(f"/api/v1/leave/{record_id}").status_code == 404


def test_leave_not_found(client) -> None:
    assert client.get("/api/v1/leave/999").status_code == 404
    assert client.put("/api/v1/leave/999", json=LEAVE).status_code == 404
    assert client.delete("/api/v1/leave/999").status_code == 404


# ---------------------------------------------------------------------------
# Budgets
# ---------------------------------------------------------------------------

BUDGET = {
    "department": "Engineering",
    "period_start": "2026-01-01",
    "period_end": "2026-03-31",
    "allocated_amount": "100000.00",
    "spent_amount": "42000.00",
}


def test_budget_crud(client) -> None:
    res = client.post("/api/v1/budgets", json=BUDGET)
    assert res.status_code == 201
    body = res.json()
    assert body["department"] == "Engineering"
    assert body["allocated_amount"] == "100000.00"
    assert body["spent_amount"] == "42000.00"
    record_id = body["id"]

    res = client.get(f"/api/v1/budgets/{record_id}")
    assert res.status_code == 200

    res = client.get("/api/v1/budgets")
    assert res.status_code == 200
    assert len(res.json()) == 1

    updated = {**BUDGET, "spent_amount": "55000.00"}
    res = client.put(f"/api/v1/budgets/{record_id}", json=updated)
    assert res.status_code == 200
    assert res.json()["spent_amount"] == "55000.00"

    res = client.delete(f"/api/v1/budgets/{record_id}")
    assert res.status_code == 204
    assert client.get(f"/api/v1/budgets/{record_id}").status_code == 404


def test_budget_not_found(client) -> None:
    assert client.get("/api/v1/budgets/999").status_code == 404
    assert client.put("/api/v1/budgets/999", json=BUDGET).status_code == 404
    assert client.delete("/api/v1/budgets/999").status_code == 404

