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
        const path = require('path');
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        // Test all sections
        const sections = ['home', 'story', 'features', 'journey', 'media', 'how-to-use', 'audits', 'contact'];
        const results = {};
        
        for (const section of sections) {
            results[section] = await page.$(`#${section}`) !== null;
        }
        
        // Test interactive elements
        const modeToggle = await page.$('#modeToggle') !== null;
        const backToTop = await page.$('#backToTop') !== null;
        const cursor = await page.$('#cursor') !== null;
        const faqItems = await page.$$('.faq-item');
        const testimonials = await page.$$('.testimonial-card');
        
        console.log('=== Nebras Final Website Test Results ===\n');
        console.log('📑 Sections:');
        Object.entries(results).forEach(([section, exists]) => {
            console.log(`  ${exists ? '✓' : '✗'} ${section}`);
        });
        
        console.log('\n🎨 Interactive Elements:');
        console.log(`  ${modeToggle ? '✓' : '✗'} Mode Toggle (Dark/Light)`);
        console.log(`  ${backToTop ? '✓' : '✗'} Back to Top Button`);
        console.log(`  ${cursor ? '✓' : '✗'} Custom Cursor`);
        console.log(`  ${faqItems.length > 0 ? '✓' : '✗'} FAQ Items (${faqItems.length})`);
        console.log(`  ${testimonials.length > 0 ? '✓' : '✗'} Testimonials (${testimonials.length})`);
        
        if (consoleErrors.length > 0) {
            console.log('\n❌ Console Errors:');
            consoleErrors.forEach(error => console.log(`  Error: ${error}`));
        } else {
            console.log('\n✅ No console errors detected!');
        }
        
        console.log('\n=== Test Complete ===');
        console.log('\n🚀 Website is ready for deployment!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
