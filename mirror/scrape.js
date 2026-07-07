const { chromium } = require('playwright');
const fs = require('fs');

(async () => {

  const browser = await chromium.launch({
    headless: false,   // IMPORTANT: real browser
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--no-sandbox'
    ]
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

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

  for (let r = 0; r <= 24; r++) {
    pagesToMirror.push({
      url: `https://www.footywire.com/afl/footy/supercoach_round?year=2026&round=${r}&p=&s=T`,
      file: `mirror/round_${r}.html`
    });
  }

  for (const p of pagesToMirror) {
    try {
      console.log("Fetching:", p.url);

      await page.goto(p.url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      await page.waitForTimeout(4000);

      try {
        await page.waitForSelector('table', { timeout: 15000 });
      } catch (e) {
        console.log("No table found, saving page anyway.");
      }

      const html = await page.content();
      fs.writeFileSync(p.file, html);

    } catch (err) {
      console.log("Error fetching:", p.url, err);
    }
  }

  await browser.close();

})();      url: `https://www.footywire.com/afl/footy/supercoach_round?year=2026&round=${r}&p=&s=T`,
      file: `mirror/round_${r}.html`
    });
  }

  // Loop through all pages
  for (const p of pagesToMirror) {
    try {
      console.log("Fetching:", p.url);

      await page.goto(p.url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      // Allow Cloudflare JS to settle
      await page.waitForTimeout(3000);

      // Try to wait for a table, but don't crash if missing
      try {
        await page.waitForSelector('table', { timeout: 15000 });
      } catch (e) {
        console.log("No table found, saving page anyway.");
      }

      const html = await page.content();
      fs.writeFileSync(p.file, html);

    } catch (err) {
      console.log("Error fetching:", p.url, err);
    }
  }

  await browser.close();

})();
