const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/microsoft-edge', // Đường dẫn đúng tới Edge trên Linux
        headless: false, // hoặc false nếu bạn muốn hiển thị trình duyệt
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://www.google.com');

    // Tìm kiếm một từ khóa
    const searchBox = await page.$('input[name="q"]');
    await searchBox.type('Hello World');
    await searchBox.press('Enter');

    // Chờ kết quả tải
    await page.waitForNavigation();

    console.log('Title is:', await page.title());

    await browser.close();
})();
