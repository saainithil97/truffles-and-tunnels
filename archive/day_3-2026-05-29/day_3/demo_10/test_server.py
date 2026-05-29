from fastapi.testclient import TestClient

import server

client = TestClient(server.app)


def test_index_serves():
    res = client.get("/")
    assert res.status_code == 200
    assert "Meghana Foods" in res.text


def test_index_is_html():
    res = client.get("/")
    assert "text/html" in res.headers["content-type"]


def test_style_served_as_css():
    res = client.get("/style.css")
    assert res.status_code == 200
    assert "css" in res.headers["content-type"]


def test_app_js_served_as_javascript():
    res = client.get("/app.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]


def test_page_has_form_and_feed_hooks():
    html = client.get("/").text
    assert 'id="review-form"' in html
    assert 'id="review-input"' in html
    assert 'id="review-feed"' in html


def test_app_js_has_both_render_paths():
    js = client.get("/app.js").text
    assert "innerHTML" in js  # the unsafe path exists
    assert "textContent" in js  # the safe path exists


def test_requests_are_logged(capsys):
    client.get("/style.css")
    out = capsys.readouterr().out
    assert "-> GET /style.css" in out
