const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // Reference site
  console.log('\n=== REFERENCE SITE ===');
  const page1 = await browser.newPage();
  await page1.goto('https://margintradingbtx.com/trading', { waitUntil: 'networkidle2' });
  await page1.waitForTimeout(5000);

  const refData = await page1.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.highcharts-xaxis-labels text'));
    const positions = labels.map(el => ({
      x: parseFloat(el.getAttribute('x')),
      text: el.textContent.trim()
    }));
    const spacings = [];
    for (let i = 1; i < positions.length; i++) {
      spacings.push((positions[i].x - positions[i-1].x).toFixed(1));
    }
    const avg = spacings.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) / spacings.length;
    return {
      total: labels.length,
      labels: positions.map(p => p.text),
      avgSpacing: avg.toFixed(1)
    };
  });

  console.log('Total labels:', refData.total);
  console.log('Labels:', refData.labels.join(', '));
  console.log('Avg spacing:', refData.avgSpacing, 'px');

  // Our site
  console.log('\n=== OUR SITE ===');
  const page2 = await browser.newPage();
  await page2.goto('http://localhost:8080/trading', { waitUntil: 'networkidle2' });
  await page2.waitForTimeout(5000);

  const ourData = await page2.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.highcharts-xaxis-labels text'));
    const positions = labels.map(el => ({
      x: parseFloat(el.getAttribute('x')),
      text: el.textContent.trim()
    }));
    const spacings = [];
    for (let i = 1; i < positions.length; i++) {
      spacings.push((positions[i].x - positions[i-1].x).toFixed(1));
    }
    const avg = spacings.reduce((a,b) => parseFloat(a) + parseFloat(b), 0) / spacings.length;
    return {
      total: labels.length,
      labels: positions.map(p => p.text),
      avgSpacing: avg.toFixed(1)
    };
  });

  console.log('Total labels:', ourData.total);
  console.log('Labels:', ourData.labels.join(', '));
  console.log('Avg spacing:', ourData.avgSpacing, 'px');

  console.log('\n=== COMPARISON ===');
  console.log('Reference:', refData.total, 'labels @', refData.avgSpacing, 'px');
  console.log('Ours:', ourData.total, 'labels @', ourData.avgSpacing, 'px');

  await page1.waitForTimeout(10000);
  await browser.close();
})();
