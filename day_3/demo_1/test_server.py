from fastapi.testclient import TestClient

import server

# The app.js route has a deliberate demo delay (see server.APP_JS_DELAY_SECONDS).
# Disable it here so the suite stays fast — the delay is a teaching device, not
# behaviour under test.
server.APP_JS_DELAY_SECONDS = 0

client = TestClient(server.app)


def test_root_serves_card_html():
    res = client.get("/")
    assert res.status_code == 200
    assert "Meghana Foods" in res.text


def test_stylesheet_served_with_css_type():
    res = client.get("/style.css")
    assert res.status_code == 200
    assert "text/css" in res.headers["content-type"]


def test_script_served_with_js_type():
    res = client.get("/app.js")
    assert res.status_code == 200
    assert "javascript" in res.headers["content-type"]


def test_image_served_with_image_type():
    res = client.get("/meghana-biryani.jpg")
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("image/")


def test_every_request_is_logged():
    before = server.request_count
    client.get("/")
    client.get("/style.css")
    assert server.request_count == before + 2


def test_static_assets_are_cacheable():
    # The "(disk cache)" beat needs the server to tell the browser it may reuse
    # these for an hour (Cache-Control: max-age=3600). Without it the browser
    # only revalidates (304s) and never shows the 0ms disk-cache hits.
    for path in ("/style.css", "/app.js", "/meghana-biryani.jpg"):
        res = client.get(path)
        assert "max-age=3600" in res.headers.get("cache-control", ""), path


def test_html_document_is_not_cached():
    # The document itself stays fresh, so on the second load only the *assets*
    # come from disk cache — "half the waterfall." That's the teaching contrast.
    res = client.get("/")
    assert "no-cache" in res.headers.get("cache-control", "")
