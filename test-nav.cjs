const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Listen for console events
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  console.log('Navigating to /projects...');
  await page.goto('http://localhost:5174/projects', { waitUntil: 'networkidle0' });
  
  console.log('Clicking hamburger menu...');
  await page.click('button[aria-label="Toggle menu"]');
  await page.waitForTimeout(500);
  
  console.log('Clicking Works link...');
  await page.click('a[href="/works"]');
  await page.waitForTimeout(1000);
  
  const content = await page.content();
  if (!content.includes('Creating Architecture')) {
    console.log('ERROR: Hero text not found on /works!');
  } else {
    console.log('SUCCESS: Hero text found.');
  }
  
  await browser.close();
})();
