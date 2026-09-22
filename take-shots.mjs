import { chromium } from "playwright";

const BASE = "http://localhost:5173";
const browser = await chromium.launch();

// 桌面截图
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.screenshot({ path: "shots/home.png", fullPage: true });

await page.goto(BASE + "/work", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "牧野", exact: true }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "shots/work-filtered.png", fullPage: true });

await page.locator(".masonry-button").nth(1).click();
await page.waitForSelector(".lightbox");
await page.locator(".lightbox-arrow-next").click();
await page.waitForTimeout(300);
await page.screenshot({ path: "shots/lightbox.png" });
await page.keyboard.press("Escape");

await page.goto(BASE + "/work/highland-pastoral", { waitUntil: "networkidle" });
await page.screenshot({ path: "shots/series.png", fullPage: true });

await page.goto(BASE + "/about", { waitUntil: "networkidle" });
await page.screenshot({ path: "shots/about.png", fullPage: true });

await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "发送", exact: true }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: "shots/contact-errors.png" });
await page.locator("#contact-name").fill("测试用户");
await page.locator("#contact-email").fill("test@example.com");
await page.locator("#contact-message").fill("想约拍一组高原人像。");
await page.getByRole("button", { name: "发送", exact: true }).click();
await page.waitForSelector(".form-success");
await page.screenshot({ path: "shots/contact-success.png" });
await ctx.close();

// 移动端截图
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage();
await mp.goto(BASE + "/work", { waitUntil: "networkidle" });
await mp.screenshot({ path: "shots/work-mobile.png", fullPage: true });
await mp.locator(".masonry-button").first().click();
await mp.waitForSelector(".lightbox");
await mp.screenshot({ path: "shots/lightbox-mobile.png" });
await mctx.close();

await browser.close();
console.log("screenshots done");
