def _add_transaction(client, txn_type: str, amount: str, txn_date: str, category: str = "general"):
    response = client.post(
        "/api/v1/transactions",
        json={
            "type": txn_type,
            "description": f"{txn_type} {amount}",
            "amount": amount,
            "date": txn_date,
            "category": category,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_financial_totals(client) -> None:
    _add_transaction(client, "revenue", "10000.00", "2026-02-01", "sales")
    _add_transaction(client, "expense", "2500.50", "2026-02-03", "travel")

    dashboard = client.get("/api/v1/dashboard")
    assert dashboard.status_code == 200
    body = dashboard.json()
    assert body["employee_count"] == 0
    assert body["total_revenue"] == "10000.00"
    assert body["total_expenses"] == "2500.50"
    assert body["net_profit_loss"] == "7499.50"


def test_profit_loss_date_filter(client) -> None:
    _add_transaction(client, "revenue", "5000.00", "2026-01-15")
    _add_transaction(client, "revenue", "2000.00", "2026-03-01")
    _add_transaction(client, "expense", "1000.00", "2026-01-20")
    _add_transaction(client, "expense", "400.00", "2026-04-01")

    report = client.get(
        "/api/v1/reports/profit-loss",
        params={"start_date": "2026-01-01", "end_date": "2026-01-31"},
    )
    assert report.status_code == 200
    body = report.json()
    assert body["total_revenue"] == "5000.00"
    assert body["total_expenses"] == "1000.00"
    assert body["net_profit_loss"] == "4000.00"


def test_profit_loss_rejects_inverted_dates(client) -> None:
    response = client.get(
        "/api/v1/reports/profit-loss",
        params={"start_date": "2026-03-01", "end_date": "2026-01-01"},
    )
    assert response.status_code == 400
    assert "start_date" in response.json()["detail"]
