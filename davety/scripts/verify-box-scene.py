from pathlib import Path

from playwright.sync_api import sync_playwright


mid_out = Path("/tmp/davety-box-mid.png")
final_out = Path("/tmp/davety-box-opened.png")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 720})
    page.goto("http://localhost:3000/box", wait_until="networkidle")
    page.get_by_role("button", name="Kutuyu Aç").click()
    page.wait_for_timeout(2250)
    page.screenshot(path=str(mid_out), full_page=False)
    page.wait_for_timeout(2450)
    canvas_count = page.locator("canvas").count()
    status = page.locator("text=davetiye çıktı").count()
    page.screenshot(path=str(final_out), full_page=False)
    browser.close()

print(f"canvas_count={canvas_count}")
print(f"settled_status_count={status}")
print(f"mid_screenshot={mid_out}")
print(f"final_screenshot={final_out}")
