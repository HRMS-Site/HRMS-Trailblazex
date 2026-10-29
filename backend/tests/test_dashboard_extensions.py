"""Tests for extended GET /api/v1/reports/profit-loss endpoint.

Covers:
- Compatibility: net_profit and net_profit_loss are identical.
- Monthly trend aggregation, including months with zero transactions.
- Profit margin calculation, including zero revenue safety.
- Budget utilization across overlapping periods, including zero spent and empty states.
- Department summary structure and honest zero-attribution behavior.
"""

def _add_txn(client, txn_type: str, amount: str, txn_date: str, category: str = "general"):
    res = client.post(
        "/api/v1/transactions",
        json={
            "type": txn_type,
            "description": f"{txn_type} {amount}",
            "amount": amount,
            "date": txn_date,
            "category": category,
        },
    )
    assert res.status_code == 201
    return res.json()


def _add_budget(client, department: str, start: str, end: str, allocated: str, spent: str = "0.00"):
    res = client.post(
        "/api/v1/budgets",
        json={
            "department": department,
            "period_start": start,
            "period_end": end,
            "allocated_amount": allocated,
            "spent_amount": spent,
        },
    )
    assert res.status_code == 201
    return res.json()


def _add_department(client, name: str, code: str, manager: str = "Manager"):
    res = client.post(
        "/api/v1/departments",
        json={"name": name, "code": code, "manager_name": manager},
    )
    assert res.status_code == 201
    return res.json()


def test_profit_loss_response_compatibility(client) -> None:
    _add_txn(client, "revenue", "10000.00", "2026-02-01")
    _add_txn(client, "expense", "2500.00", "2026-02-15")

    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-02-01", "end_date": "2026-02-28"})
    assert res.status_code == 200
    body = res.json()

    # Legacy and frontend field compatibility
    assert body["total_revenue"] == "10000.00"
    assert body["total_expenses"] == "2500.00"
    assert body["net_profit_loss"] == "7500.00"
    assert body["net_profit"] == "7500.00"
    assert body["profit_margin"] == "75.00"
    assert "trends" in body
    assert "department_summaries" in body


def test_trend_aggregation_and_empty_months(client) -> None:
    # January has revenue
    _add_txn(client, "revenue", "4000.00", "2026-01-10")
    # February has NO transactions
    # March has expense
    _add_txn(client, "expense", "1500.00", "2026-03-20")

    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-01-01", "end_date": "2026-03-31"})
    assert res.status_code == 200
    trends = res.json()["trends"]

    assert len(trends) == 3
    assert trends[0] == {"period": "2026-01", "revenue": "4000.00", "expenses": "0.00"}
    # Month with no transactions is zero-filled
    assert trends[1] == {"period": "2026-02", "revenue": "0.00", "expenses": "0.00"}
    assert trends[2] == {"period": "2026-03", "revenue": "0.00", "expenses": "1500.00"}


def test_profit_margin_zero_revenue_safe(client) -> None:
    # Only expenses, zero revenue
    _add_txn(client, "expense", "500.00", "2026-05-10")

    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-05-01", "end_date": "2026-05-31"})
    assert res.status_code == 200
    body = res.json()

    assert body["total_revenue"] == "0.00"
    assert body["total_expenses"] == "500.00"
    assert body["net_profit"] == "-500.00"
    assert body["profit_margin"] == "0.00"


def test_budget_utilization_overlapping_periods(client) -> None:
    # Case 1: No budgets in system -> None
    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-01-01", "end_date": "2026-01-31"})
    assert res.status_code == 200
    assert res.json()["budget_utilization"] is None

    # Case 2: Add budget overlapping Q1
    _add_budget(client, "Engineering", "2026-01-01", "2026-03-31", allocated="100000.00", spent="42000.00")
    # Add another budget in Q2 (should not affect Q1 query)
    _add_budget(client, "Marketing", "2026-04-01", "2026-06-30", allocated="50000.00", spent="10000.00")

    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-01-01", "end_date": "2026-03-31"})
    assert res.status_code == 200
    assert res.json()["budget_utilization"] == "42.00"


def test_budget_utilization_zero_spent_safe(client) -> None:
    _add_budget(client, "Research", "2026-07-01", "2026-07-31", allocated="50000.00", spent="0.00")

    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-07-01", "end_date": "2026-07-31"})
    assert res.status_code == 200
    assert res.json()["budget_utilization"] == "0.00"


def test_department_summaries_structure(client) -> None:
    # Initially no departments
    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-01-01", "end_date": "2026-01-31"})
    assert res.status_code == 200
    assert res.json()["department_summaries"] == []

    # Add departments
    _add_department(client, "Engineering", "ENG", "Alice")
    _add_department(client, "Finance", "FIN", "Bob")

    res = client.get("/api/v1/reports/profit-loss", params={"start_date": "2026-01-01", "end_date": "2026-01-31"})
    assert res.status_code == 200
    summaries = res.json()["department_summaries"]

    assert len(summaries) == 2
    # Verify exact schema expected by frontend
    for item in summaries:
        assert "department" in item
        assert item["revenue"] == "0.00"
        assert item["expenses"] == "0.00"
        assert item["net_profit"] == "0.00"
