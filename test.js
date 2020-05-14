const puppeteer = require('puppeteer');
const fileSystem = require('./fileSystem');
fileName = './kenh14.json';
fileSystem.createNewfile(fileName);
(async() => {

    // Mở trình duyệt mới và tới trang của kenh14
    const browser = await puppeteer.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.goto('https://www.now.vn/ha-noi/danh-sach-dia-diem-giao-tan-noi');

    // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article
    const articles = await page.evaluate(() => {
        let titleLinks = document.querySelectorAll('div.info-basic-res>h4');
        // let address = document.querySelectorAll('div.info-basic-res>div');
        titleLinks = [...titleLinks];
        // address = [...address];
        let articles = titleLinks.map(link => ({
            title: link.getAttribute('title'),
            url: link.getAttribute('title')
        }));
        return articles;
    });
    
    fileSystem.saveJsonObjectToFile(articles, fileName);
    // In ra kết quả và đóng trình duyệt
    console.log(articles);
    await browser.close();
})();