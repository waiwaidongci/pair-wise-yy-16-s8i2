import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:5173";
let failures = 0;

function check(name, cond, extra = "") {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failures++;
  console.log(`[${mark}] ${name}${extra ? " — " + extra : ""}`);
}

const browser = await chromium.launch();

// ---------- 桌面上下文：监控外部字体请求 ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const externalFontReqs = [];
const allExternal = [];
page.on("request", (req) => {
  const url = req.url();
  if (/fonts\.(googleapis|gstatic)\.com/.test(url)) externalFontReqs.push(url);
  if (!url.startsWith(BASE) && !url.startsWith("ws://localhost") && !url.startsWith("data:"))
    allExternal.push(url);
});

// ---------- 状态 A：首页 ----------
await page.goto(BASE + "/", { waitUntil: "networkidle" });
check("A: 首页标题可见", await page.locator(".hero-name").isVisible());
check("A: 三个系列入口", (await page.locator(".series-card").count()) === 3);
const cardTitles = await page.locator(".series-card-title").allTextContents();
check("A: 系列标题正确", JSON.stringify(cardTitles) === JSON.stringify(["凝视", "无人之境", "高原牧歌"]), cardTitles.join("/"));
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
check("A: 暗色主题", bg === "rgb(10, 10, 10)", bg);

// ---------- 状态 B：/work 筛选 ----------
await page.goto(BASE + "/work", { waitUntil: "networkidle" });
check("B: 未筛选时 14 张", (await page.locator(".masonry-item").count()) === 14);
await page.getByRole("button", { name: "牧野", exact: true }).click();
await page.waitForTimeout(200);
check("B: 牧野筛选后 4 张", (await page.locator(".masonry-item").count()) === 4);
const pillActive = await page.locator(".filter-pill.is-active").textContent();
check("B: 牧野为选中态", pillActive === "牧野", pillActive);

// ---------- 状态 C：灯箱限定范围导航 ----------
// 点击第 2 张牧野照片（pastoral-02）
await page.locator(".masonry-button").nth(1).click();
await page.waitForSelector(".lightbox");
let title = await page.locator(".lightbox-title").textContent();
check("C: 打开第 2 张 = 坡地牛群(pastoral-02)", title === "坡地牛群", title);
let counter = await page.locator(".lightbox-counter").textContent();
check("C: 计数器 2 / 4", counter.trim() === "2 / 4", counter);
await page.locator(".lightbox-arrow-next").click();
title = await page.locator(".lightbox-title").textContent();
counter = await page.locator(".lightbox-counter").textContent();
check("C: 下一张 = 雪山下的歇息(pastoral-03)", title === "雪山下的歇息", title);
check("C: 计数器 3 / 4", counter.trim() === "3 / 4", counter);
await page.locator(".lightbox-arrow-next").click();
title = await page.locator(".lightbox-title").textContent();
check("C: 再下一张 = 新疆牧场(pastoral-04)", title === "新疆牧场", title);
await page.locator(".lightbox-arrow-next").click();
title = await page.locator(".lightbox-title").textContent();
counter = await page.locator(".lightbox-counter").textContent();
check("C: 循环回 pastoral-01（不越界）", title === "独牛与木屋", title);
check("C: 计数器 1 / 4（非 x/14）", counter.trim() === "1 / 4", counter);
await page.locator(".lightbox-arrow-prev").click();
title = await page.locator(".lightbox-title").textContent();
check("C: 上一张循环回 pastoral-04", title === "新疆牧场", title);
// 键盘导航
await page.keyboard.press("ArrowRight");
title = await page.locator(".lightbox-title").textContent();
check("C: 键盘 → 有效", title === "独牛与木屋", title);
await page.keyboard.press("Escape");
check("C: Escape 关闭灯箱", (await page.locator(".lightbox").count()) === 0);

// ---------- 约束 1：筛选状态跨导航保持 ----------
await page.getByRole("link", { name: "首页" }).click();
await page.getByRole("link", { name: /进入系列：高原牧歌/ }).click();
await page.waitForURL("**/work/highland-pastoral");
await page.getByRole("link", { name: "← 返回全部作品" }).first().click();
await page.waitForURL("**/work");
await page.waitForTimeout(200);
const countAfterBack = await page.locator(".masonry-item").count();
const pillAfterBack = await page.locator(".filter-pill.is-active").textContent();
check("约束1: 返回后仍为 4 张牧野", countAfterBack === 4, `count=${countAfterBack}`);
check("约束1: 返回后牧野仍选中", pillAfterBack === "牧野", pillAfterBack);

// ---------- 状态 D：系列详情页 ----------
await page.goto(BASE + "/work/highland-pastoral", { waitUntil: "networkidle" });
check("D: 系列标题", (await page.locator(".series-hero-title").textContent()) === "高原牧歌");
const quote = page.locator(".series-pullquote p");
check("D: 摘要引言可见", (await quote.textContent()).includes("牧场、牛群与人在高原上的共生关系"));
const quoteStyle = await quote.evaluate((el) => {
  const s = getComputedStyle(el);
  return { style: s.fontStyle, family: s.fontFamily };
});
check("D: 引言为斜体 Playfair", quoteStyle.style === "italic" && quoteStyle.family.includes("Playfair"), JSON.stringify(quoteStyle));
const narrativeTitles = await page.locator(".narrative-title").allTextContents();
check(
  "D: 4 张照片按 order 出现",
  JSON.stringify(narrativeTitles) === JSON.stringify(["独牛与木屋", "坡地牛群", "雪山下的歇息", "新疆牧场"]),
  narrativeTitles.join("/"),
);
const firstCaption = await page.locator(".narrative-caption").first().textContent();
check("D: 使用真实说明文字", firstCaption === "木屋比牛安静，牛比风安静。", firstCaption);
// 系列页灯箱范围 = 该系列 4 张
await page.locator(".narrative-image").first().click();
await page.waitForSelector(".lightbox");
counter = await page.locator(".lightbox-counter").textContent();
check("D: 系列页灯箱计数 1 / 4", counter.trim() === "1 / 4", counter);
await page.locator(".lightbox-close").click();

// ---------- 约束 3：宽高比占位（CLS） ----------
await page.goto(BASE + "/work", { waitUntil: "domcontentloaded" });
const ratios = await page.evaluate(() => {
  return [...document.querySelectorAll(".masonry-item .photo-frame")].slice(0, 5).map((el) => {
    const r = el.getBoundingClientRect();
    return +(r.width / r.height).toFixed(2);
  });
});
// 期望（photos.json width/height）：portrait-01 4067/6000≈0.68, 02≈0.67, 03≈0.67, 04≈0.67, 05≈0.67
check("约束3: 占位比例与片源一致", ratios.every((r) => Math.abs(r - 0.67) < 0.02), JSON.stringify(ratios));
const landscapeRatio = await page.evaluate(() => {
  const items = [...document.querySelectorAll(".masonry-item .photo-frame")];
  const el = items[5]; // landscape-01 5404x3584 ≈ 1.51
  const r = el.getBoundingClientRect();
  return +(r.width / r.height).toFixed(2);
});
check("约束3: 横版照片比例 ≈1.51", Math.abs(landscapeRatio - 1.51) < 0.02, String(landscapeRatio));

// ---------- 状态 F：联系表单 ----------
await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
// F1：空表单提交
await page.getByRole("button", { name: "发送", exact: true }).click();
await page.waitForTimeout(100);
const errorCount = await page.locator(".field-error").count();
check("F1: 空提交出现 3 条行内错误", errorCount === 3, `errors=${errorCount}`);
const btnDisabled = await page.getByRole("button", { name: "发送", exact: true }).isDisabled();
check("F1: 校验未通过提交按钮被禁用", btnDisabled);
check("F1: 未出现成功态", (await page.locator(".form-success").count()) === 0);
// 填入非法邮箱
await page.locator("#contact-name").fill("测试用户");
await page.locator("#contact-email").fill("not-an-email");
await page.locator("#contact-message").fill("想约拍一组高原人像。");
await page.waitForTimeout(100);
const emailErr = await page.locator("#contact-email-error").textContent();
check("F1: 非法邮箱有对应错误", emailErr.includes("格式"), emailErr);
// F2：合法提交
await page.locator("#contact-email").fill("test@example.com");
await page.waitForTimeout(100);
const btnEnabled = await page.getByRole("button", { name: "发送", exact: true }).isEnabled();
check("F2: 全部合法后按钮可用", btnEnabled);
await page.getByRole("button", { name: "发送", exact: true }).click();
await page.waitForSelector(".form-success", { timeout: 3000 });
check("F2: 出现成功态", await page.locator(".form-success").isVisible());
check("F2: 成功态含邮箱回显", (await page.locator(".form-success").textContent()).includes("test@example.com"));
check("F2: 原表单已被替换", (await page.locator(".contact-form").count()) === 0);

// ---------- 约束 6：字体 ----------
await page.goto(BASE + "/", { waitUntil: "networkidle" });
check("约束6: 无 Google Fonts 请求", externalFontReqs.length === 0, externalFontReqs.join(","));
check("约束6: 无任何外部请求", allExternal.length === 0, allExternal.slice(0, 3).join(","));
const fontLoaded = await page.evaluate(async () => {
  // load() 会真实触发字体文件下载；check() 只查询已加载状态
  const results = await Promise.all([
    document.fonts.load('16px "Inter"'),
    document.fonts.load('600 16px "Playfair Display"'),
    document.fonts.load('italic 16px "Playfair Display"'),
  ]);
  return {
    inter: results[0].length > 0,
    playfair: results[1].length > 0,
    playfairItalic: results[2].length > 0,
  };
});
check("约束6: 本地字体已加载", fontLoaded.inter && fontLoaded.playfair && fontLoaded.playfairItalic, JSON.stringify(fontLoaded));

await ctx.close();

// ---------- 状态 E：移动端 ----------
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mpage = await mctx.newPage();
await mpage.goto(BASE + "/work", { waitUntil: "networkidle" });
const cols = await mpage.evaluate(() => {
  const items = [...document.querySelectorAll(".masonry-item")];
  const xs = new Set(items.map((el) => Math.round(el.getBoundingClientRect().x)));
  return xs.size;
});
check("E: 移动端单列布局", cols === 1, `distinct x = ${cols}`);
const captionVisible = await mpage.locator(".masonry-caption").first().isVisible();
check("E: 移动端说明在图片下方", captionVisible);
const overlayHidden = await mpage.locator(".masonry-overlay").first().evaluate((el) => getComputedStyle(el).display === "none");
check("E: 移动端 hover 浮层已隐藏", overlayHidden);
// 移动端灯箱：说明在底部
await mpage.locator(".masonry-button").first().click();
await mpage.waitForSelector(".lightbox");
const infoBox = await mpage.locator(".lightbox-info").boundingBox();
const viewportH = 844;
check("E: 灯箱说明固定在底部", infoBox && infoBox.y + infoBox.height >= viewportH - 2 && infoBox.width >= 380, JSON.stringify(infoBox));
await mpage.locator(".lightbox-close").click();
await mctx.close();

await browser.close();
console.log(failures === 0 ? "\n全部通过 ✓" : `\n${failures} 项失败 ✗`);
process.exit(failures === 0 ? 0 : 1);
