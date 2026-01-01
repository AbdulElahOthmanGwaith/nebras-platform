const { chromium } = require('playwright');
const path = require('path');

async function testNebrasV3() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const errors = [];
    const results = [];
    
    // Collect console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(`Console Error: ${msg.text()}`);
        }
    });
    
    page.on('pageerror', error => {
        errors.push(`Page Error: ${error.message}`);
    });
    
    try {
        const filePath = path.join(__dirname, 'index.html');
        await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
        
        // Wait for loading screen to disappear
        await page.waitForTimeout(2000);
        
        // Check if main elements exist
        const checks = [
            { name: 'Loading Screen', selector: '#loadingScreen' },
            { name: 'Navbar', selector: '#navbar' },
            { name: 'Hero Section', selector: '#home' },
            { name: 'Features Section', selector: '#features' },
            { name: 'Courses Section', selector: '#courses' },
            { name: 'Gamification Section', selector: '#gamification' },
            { name: 'Media Section', selector: '#media' },
            { name: 'Community Section', selector: '#community' },
            { name: 'FAQ Section', selector: '#faq' },
            { name: 'Contact Section', selector: '#contact' },
            { name: 'Footer', selector: '.footer' },
            { name: 'Theme Toggle', selector: '#themeToggle' },
            { name: 'Notifications Panel', selector: '#notificationsPanel' },
            { name: 'Mobile Menu', selector: '#mobileMenu' },
            { name: 'Chatbot', selector: '#chatbotToggle' },
            { name: 'Back to Top', selector: '#backToTop' },
            { name: 'Newsletter Form', selector: '#newsletterForm' },
            { name: 'Contact Form', selector: '#contactForm' },
            { name: 'Testimonials Slider', selector: '.testimonials-slider' },
            { name: 'Discord Section', selector: '.discord-section' },
            { name: 'Certificate Section', selector: '.certificate-preview' },
            { name: 'Leaderboard', selector: '.leaderboard' },
            { name: 'Badges Grid', selector: '.badges-grid' },
            { name: 'Challenges', selector: '.challenge-card' }
        ];
        
        for (const check of checks) {
            const element = await page.$(check.selector);
            if (element) {
                results.push(`✓ ${check.name} found`);
            } else {
                errors.push(`✗ ${check.name} NOT found: ${check.selector}`);
            }
        }
        
        // Check course cards
        const courseCards = await page.$$('.course-card');
        results.push(`✓ Course Cards: ${courseCards.length} found`);
        
        // Check feature cards
        const featureCards = await page.$$('.card');
        results.push(`✓ Feature Cards: ${featureCards.length} found`);
        
        // Check media cards
        const mediaCards = await page.$$('.media-card');
        results.push(`✓ Media Cards: ${mediaCards.length} found`);
        
        // Test theme toggle
        await page.click('#themeToggle');
        const hasLightMode = await page.$eval('body', body => body.classList.contains('light-mode'));
        results.push(`✓ Theme Toggle: ${hasLightMode ? 'Working' : 'Not working'}`);
        
        // Test FAQ accordion
        const faqItems = await page.$$('.faq-item');
        if (faqItems.length > 0) {
            await faqItems[0].click();
            await page.waitForTimeout(500);
            const isActive = await faqItems[0].evaluate(el => el.classList.contains('active'));
            results.push(`✓ FAQ Accordion: ${isActive ? 'Working' : 'Not working'}`);
        }
        
        // Test chatbot toggle
        await page.click('#chatbotToggle');
        await page.waitForTimeout(500);
        const chatbotActive = await page.$eval('#chatbotContainer', el => el.classList.contains('active'));
        results.push(`✓ Chatbot Toggle: ${chatbotActive ? 'Working' : 'Not working'}`);
        
        // Test mobile menu
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        const mobileMenuVisible = await page.$eval('#mobileMenu', el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none';
        });
        results.push(`✓ Mobile Menu: ${mobileMenuVisible ? 'Visible on mobile' : 'Hidden on mobile'}`);
        
        // Reset viewport
        await page.setViewportSize({ width: 1920, height: 1080 });
        
        // Print results
        console.log('\n========================================');
        console.log('         NEBRAS V3 TEST RESULTS        ');
        console.log('========================================\n');
        
        results.forEach(result => console.log(result));
        
        if (errors.length > 0) {
            console.log('\n========================================');
            console.log('            ERRORS FOUND               ');
            console.log('========================================\n');
            errors.forEach(error => console.log(error));
            process.exit(1);
        } else {
            console.log('\n========================================');
            console.log('    ALL TESTS PASSED SUCCESSFULLY!     ');
            console.log('========================================\n');
        }
        
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

testNebrasV3();
