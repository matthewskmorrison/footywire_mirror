const axios = require('axios');
const fs = require('fs');

async function fetchPage(url, file) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; Mobile) Chrome/123 Safari/537.36'
      },
      timeout: 30000
    });

    fs.writeFileSync(file, response.data);
    console.log("Saved:", file);

  } catch (err) {
    console.log("Error fetching:", url, err.message);
  }
}

(async () => {
  const pages = [
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
    pages.push({
      url: `https://www.footywire.com/afl/footy/supercoach_round?year=2026&round=${r}&p=&s=T`,
      file: `mirror/round_${r}.html`
    });
  }

  for (const p of pages) {
    await fetchPage(p.url, p.file);
  }
})();
