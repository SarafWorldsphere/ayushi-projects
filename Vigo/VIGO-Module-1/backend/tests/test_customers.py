from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_customer_api_health():
    """Verify Customer Module API routing is active."""
    response = client.get("/customers/test")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "module": "customer",
    }