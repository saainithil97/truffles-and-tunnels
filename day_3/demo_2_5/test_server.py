from fastapi.testclient import TestClient

import server

client = TestClient(server.app)


def test_index_serves():
    res = client.get("/")
    assert res.status_code == 200
    assert "Preferences" in res.text
    assert "Checkout" in res.text


def test_index_has_storage_hooks():
    html = client.get("/").text
    # The two stores the demo turns on, by their elements.
    assert 'id="dark-toggle"' in html
    assert 'id="next-btn"' in html
    assert 'id="back-btn"' in html


def test_app_js_served_as_javascript():
    res = client.get("/app.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]
    # The two keys the demo points at live in the script.
    assert "swiggy:theme" in res.text
    assert "swiggy:checkoutStep" in res.text


def test_style_css_served_as_css():
    res = client.get("/style.css")
    assert res.status_code == 200
    assert "css" in res.headers["content-type"]
    assert "#fc8019" in res.text  # Swiggy orange


def test_requests_are_logged():
    before = server.request_count
    client.get("/")
    client.get("/app.js")
    assert server.request_count >= before + 2
