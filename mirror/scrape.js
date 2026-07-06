const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-dev-shm-usage'
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

      await page.waitForTimeout(3000);

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
})();      console.log("Fetching:", p.url);

      await page.goto(p.url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      // Give Cloudflare time to settle
      await page.waitForTimeout(3000);

      // Try waiting for a table, but don't crash if missing
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
