from fastapi.testclient import TestClient

import server

client = TestClient(server.app)


def test_index_serves():
    res = client.get("/")
    assert res.status_code == 200
    assert "Why order matters" in res.text


def test_all_three_versions_serve():
    for name in ("version-a.html", "version-b.html", "version-c.html"):
        res = client.get("/" + name)
        assert res.status_code == 200
        assert "Meghana Foods" in res.text


def test_slow_js_served_as_javascript():
    res = client.get("/slow.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]


def test_version_a_has_blocking_head_script():
    html = client.get("/version-a.html").text
    head = html.split("</head>")[0]
    assert '<script src="slow.js"></script>' in head  # in head, no defer


def test_version_b_head_script_has_defer():
    html = client.get("/version-b.html").text
    head = html.split("</head>")[0]
    assert 'src="slow.js" defer' in head


def test_version_c_script_is_after_body_content():
    html = client.get("/version-c.html").text
    head = html.split("</head>")[0]
    assert "slow.js" not in head  # not in <head>
    assert html.index("Meghana Foods") < html.index('src="slow.js"')
