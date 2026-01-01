const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Track console errors
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
        // Navigate to the local file
        await page.goto(`file:///workspace/index.html`, { waitUntil: 'networkidle' });
        
        // Wait for page to fully load
        await page.waitForTimeout(2000);
        
        // Check if main elements exist
        const heroExists = await page.$('.hero') !== null;
        const navExists = await page.$('.navbar') !== null;
        const aboutExists = await page.$('.about') !== null;
        const servicesExists = await page.$('.services') !== null;
        const galleryExists = await page.$('.gallery') !== null;
        const contactExists = await page.$('.contact') !== null;
        
        console.log('=== Website Load Test Results ===');
        console.log(`Hero Section: ${heroExists ? '✓' : '✗'}`);
        console.log(`Navigation: ${navExists ? '✓' : '✗'}`);
        console.log(`About Section: ${aboutExists ? '✓' : '✗'}`);
        console.log(`Services Section: ${servicesExists ? '✓' : '✗'}`);
        console.log(`Gallery Section: ${galleryExists ? '✓' : '✗'}`);
        console.log(`Contact Section: ${contactExists ? '✓' : '✗'}`);
        
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
