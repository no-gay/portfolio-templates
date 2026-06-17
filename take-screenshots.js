const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const BASE = 'http://localhost:8765';

const pages = [
  // Десктопные (1440x900, retina 2x)
  { name: '01-portfolio',     url: '/',                w: 1440, h: 900 },
  { name: '02-beauty',        url: '/beauty/',          w: 1440, h: 900 },
  { name: '03-fitness',       url: '/fitness/',         w: 1440, h: 900 },
  { name: '04-autoservice',   url: '/autoservice/',     w: 1440, h: 900 },
  { name: '05-realestate',    url: '/realestate/',      w: 1440, h: 900 },
  { name: '06-construction',  url: '/construction/',    w: 1440, h: 900 },
  { name: '07-dentist',       url: '/dentist/',         w: 1440, h: 900 },
  { name: '08-lawyer',        url: '/lawyer/',          w: 1440, h: 900 },
  { name: '09-restaurant',    url: '/restaurant/',      w: 1440, h: 900 },
  // Мобильные (390x844, retina 2x)
  { name: '01-portfolio-m',   url: '/',                w: 390, h: 844 },
  { name: '02-beauty-m',      url: '/beauty/',          w: 390, h: 844 },
  { name: '03-fitness-m',     url: '/fitness/',         w: 390, h: 844 },
  { name: '04-autoservice-m', url: '/autoservice/',     w: 390, h: 844 },
  { name: '05-realestate-m',  url: '/realestate/',      w: 390, h: 844 },
  { name: '06-construction-m',url: '/construction/',    w: 390, h: 844 },
  { name: '07-dentist-m',     url: '/dentist/',         w: 390, h: 844 },
  { name: '08-lawyer-m',      url: '/lawyer/',          w: 390, h: 844 },
  { name: '09-restaurant-m', url: '/restaurant/',      w: 390, h: 844 },
];

(async () => {
  const browser = await chromium.launch();
  for (const p of pages) {
    const ctx = await browser.newContext({
      viewport: { width: p.w, height: p.h },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + p.url, { waitUntil: 'networkidle', timeout: 8000 });
    } catch {
      // если networkidle таймаут — страница всё равно загружена
    }
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(OUT, p.name + '.png'), fullPage: false });
    await ctx.close();
    console.log(`✅ ${p.name}`);
  }
  await browser.close();
  console.log(`\n✨ Готово! ${pages.length} скриншотов в ./screenshots/`);
})();
