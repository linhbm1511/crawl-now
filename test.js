const puppeteer = require('puppeteer');
const fileSystem = require('./fileSystem');
fileName = './kenh14.json';
URL = 'https://www.now.vn'
fileSystem.createNewfile(fileName);
(async() => {

    // Mở trình duyệt mới và tới trang của kenh14
    const browser = await puppeteer.launch({ headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.now.vn/ha-noi/danh-sach-dia-diem-giao-tan-noi');
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
        articles.forEach( (i) => {
        // promises.push(async () => {
            await page.goto(URL + articles[i].href, {
            // Set timeout cho page
                timeout: 3000000
            });
            // Chờ 2s sau khi page được load để tránh overload
            await page.waitFor(2000);
            // const form = await page.$('div.modal-footer>button');
            // await form.evaluate( form => form.click() );
            
            let res = await page.evaluate(() => {
                let dishes = document.querySelectorAll("div.item-restaurant-row>div");
                // dishes = [...dishes];
                dishes.forEach((dish) => {
                    console.log(dish.innerText);
                })
                return dishes;
            });
        
            console.log('Page ID Spawned', res);
            return res;
        // })
        })
    fileSystem.saveJsonObjectToFile(articles, fileName);
    // In ra kết quả và đóng trình duyệt
    console.log(articles);
    await browser.close();
})();
