const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
    // Khởi tạo trình duyệt Edge
    let driver = await new Builder().forBrowser('MicrosoftEdge').build();
    try {
        // Mở trang web
        await driver.get('https://www.google.com');

        // Tìm kiếm một từ khóa
        let searchBox = await driver.findElement(By.name('q'));
        await searchBox.sendKeys('Hello World', Key.RETURN);

        // Chờ kết quả tải
        await driver.wait(until.titleContains('Hello World'), 10000);
        console.log('Title is:', await driver.getTitle());
    } finally {
        // Đóng trình duyệt
        await driver.quit();
    }
})();
