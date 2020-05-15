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
    // const articles = await page.evaluate(() => {
    //     let titleLinks = document.querySelectorAll('div.item-restaurant > a');
    //     titleLinks = [...titleLinks];
    //     let articles = titleLinks.map(link => ({
    //         // title: link.getAttribute('title'),
    //         href: link.getAttribute('href'),
    //     }));
    //     return articles;
    // });
    const articles = await page.$$eval(
        'div.item-restaurant > a',
        (arts => arts.map(art => {
            return {
                href: art.href
            };
        }))
    );
    let list, restaurant
        for (let i = 0; i<2; i++) {
            await Promise.all([
                page.waitForNavigation(),
                page.goto(articles[i].href, {timeout: 3000000}),
                page.waitForSelector('h2.item-restaurant-name'),
            ]);
            // const page1 = await browser.newPage();
            // await page1.goto(URL + link, {timeout: 3000000});
            // await page1.waitFor(2000);
            // const res = await page.evaluate(() => {
                const dishes = await page.$$eval("div.item-restaurant-row > div",
                    options => {return options.map(option => option.innerText.split("\n"))});
                // dishes = [...dishes];
                // dishes.forEach((dish) => {
                //     console.log(dish.innerText);
                //     return dish.innerText;
                // })
                
                list = dishes.map((dish) => {return {name: dish[0], price: dish[dish.length - 2]}})
                console.log(list);
                // return list;
            // });
            // console.log('Page ID Spawned', res[0].innerText);
            // await page1.goto('about:blank');
            // await page1.close();
        }
    fileSystem.saveJsonObjectToFile(list, fileName);
    // In ra kết quả và đóng trình duyệt
    console.log(articles);
    await browser.close();
})();
