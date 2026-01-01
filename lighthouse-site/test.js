const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    page.on('pageerror', error => {
        consoleErrors.push(error.message);
    });
    
    try {
        await page.goto(`file:///workspace/lighthouse-site/index.html`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        const sections = ['home', 'features', 'how-to-use', 'audits', 'metrics', 'plugins', 'importance'];
        const results = {};
        
        for (const section of sections) {
            results[section] = await page.$(`#${section}`) !== null;
        }
        
        console.log('=== Lighthouse Website Test Results ===');
        Object.entries(results).forEach(([section, exists]) => {
            console.log(`${section}: ${exists ? '✓' : '✗'}`);
        });
        
        if (consoleErrors.length > 0) {
            console.log('\n=== Console Errors ===');
            consoleErrors.forEach(error => console.log(`Error: ${error}`));
        } else {
            console.log('\n✓ No console errors detected!');
        }
        
        console.log('\n=== Test Complete ===');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
