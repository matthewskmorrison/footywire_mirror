const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const pagesToMirror = [
    {
      url: "https://www.footywire.com/afl/footy/supercoach_breakevens",
      file: "mirror/footywire_breakevens.html"
    },
    {
      url: "https://www.footywire.com/afl/footy/supercoach_prices",
      file: "mirror/footywire_prices.html"
    }
  ];

  // Add round pages
  for (let r = 0; r <= 24; r++) {
    pagesToMirror.push({
      url: `https://www.footywire.com/afl/footy/supercoach_round?year=2026&round=${r}&p=&s=T`,
      file: `mirror/round_${r}.html`
    });
  }

  for (const p of pagesToMirror) {
    await page.goto(p.url, { waitUntil: 'networkidle' });
    await page.waitForSelector('table');
    const html = await page.content();
    fs.writeFileSync(p.file, html);
  }

  await browser.close();
})();
