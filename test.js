const puppeteer = require('puppeteer');
const fileSystem = require('./fileSystem');
fileName = './kenh14.json';
URL = 'https://www.now.vn'
fileSystem.createNewfile(fileName);
(async() => {

    // Mở trình duyệt mới và tới trang của kenh14
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto(URL+'/ha-noi/danh-sach-dia-diem-giao-tan-noi');
    await page.waitFor(3000);
    // Chạy đoạn JavaScript trong hàm này, đưa kết quả vào biến article
    const articles = await page.evaluate(() => {
        let titleLinks = document.querySelectorAll('div.item-restaurant > a');
        titleLinks = [...titleLinks];
        let articles = titleLinks.map(link => ({
            // title: link.getAttribute('title'),
            href: link.getAttribute('href'),
        }));
        return articles;
    });
    const promises = [];
        for (let art of articles) {
            const page1 = await browser.newPage();
            await page1.goto(URL + art.href, {timeout: 3000000});
            await page1.waitFor(2000);
            let res = await page1.evaluate(() => {
                let dishes = document.querySelectorAll("div.item-restaurant-row>div");
                dishes = [...dishes]
                // dishes.forEach((dish) => {
                //     console.log(dish.innerText);
                //     return dish.innerText;
                // })
                return dishes;
            });
            console.log('Page ID Spawned', res[0].innerText);
            await page1.goto('about:blank');
            await page1.close();
        }
    fileSystem.saveJsonObjectToFile(articles, fileName);
    // In ra kết quả và đóng trình duyệt
    console.log(articles);
    await browser.close();
})();
