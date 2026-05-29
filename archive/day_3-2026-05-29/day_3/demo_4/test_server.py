from fastapi.testclient import TestClient

import server

client = TestClient(server.app)


def test_index_serves():
    res = client.get("/")
    assert res.status_code == 200
    assert "The expensive DOM" in res.text


def test_index_references_assets():
    html = client.get("/").text
    assert 'href="style.css"' in html
    assert 'src="app.js"' in html


def test_style_served_as_css():
    res = client.get("/style.css")
    assert res.status_code == 200
    assert "css" in res.headers["content-type"]


def test_app_js_served_as_javascript():
    res = client.get("/app.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]


def test_grid_container_present():
    html = client.get("/").text
    assert 'id="grid"' in html


def test_both_resize_buttons_present():
    html = client.get("/").text
    assert 'id="slow"' in html
    assert 'id="fast"' in html
    assert 'id="reset"' in html


def test_requests_are_logged(capfd):
    client.get("/style.css")
    out = capfd.readouterr().out
    assert "-> GET /style.css" in out
