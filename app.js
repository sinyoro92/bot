const puppeteer = require('puppeteer');
const fs = require("fs");
const csv = require("@fast-csv/parse");
const News = require('./schema/news.schema');
const newsSchema = require('./schema/news.schema');
const { default: mongoose } = require('mongoose');




const scrapNews = async () => {
    const db = require('./db.connection');
    db();

    const News = require('./schema/news.schema')

    const browser = await puppeteer.launch(
        {
            headless: true,
            defaultViewport: null
        }
    );

    const takeShot = async (browser ,page) => {
        await page.screenshot({ path: 'example.png' });
        await browser.close();

    };


    const clickSelector = async (page, selector) => {
        await page.waitForSelector(selector);
        await page.$eval(selector, elem => elem.click({delay: 100}));
    }
    const typeInput = async (page, text, name) => {
        await page.waitForSelector(name);
        await page.type(name, text);
        
    }
    const textSelector = async (page, name) => {
        await page.waitForSelector(name);
        const pageFrame = page.mainFrame();
        const elems = await pageFrame.$$(name);
        const articles = [];


        for (let i = 0; i < elems.length; i++){
            articles.push({ title: await page.evaluate(el => el.textContent, elems[i]), href: await page.evaluate(el => el.href, elems[i]) });
        }
        return articles;
    }

    const infoSelector = async (page, name) => {
        let date;
        const article = [];

        await page.waitForSelector(name);
        const pageFrame = page.mainFrame();
        const elems = await pageFrame.$$(name);

        date = await page.evaluate(el => el.textContent, await pageFrame.$('.s-meta-published-date'));
        image = await page.evaluate(el => el.src, await pageFrame.$('#article-body>div.s-post-thumbnail>picture>img'));

        for (let i = 0; i < elems.length; i++){
            article.push(await page.evaluate(el => el.textContent, elems[i]));


        }
        return ({article, date , image});
    }

    const getTitles = async () => {
        

        const page = await browser.newPage();
        await page.goto("https://www.kwayedza.co.zw/category/nhau-dzekumatare/");

        try {
            return Promise.resolve(await textSelector(page, ".list-article-title>a"));
        } catch (error) {
            console.log(`Work interapted, ${error.message}`);
        }         
    }


    const getArticle = async (url) => {

        const page = await browser.newPage();
        await page.goto(url);

        try {
            return Promise.resolve(await infoSelector(page, "#article-content>p"));
            
        } catch (error) {
            console.log(`Work interapted `);
        }         
    }

    getTitles().then(async data => {
        try {
            console.log("Got all titles ...");
            let articles = [];
            for (let i = 0; i < data.length; i++) {
                console.log(`Working on [${data[i].title}] now`);
                const href = data[i].href;
                const info = await getArticle(href);
                articles.push({ ...data[i], date:info.date, image: info.image ,info: info.article.toString() });
                
            }


            await News.create(articles);
            console.log("Scrapping Done ");
        } catch (error) {
            console.log(`Work interapted `, error);
            
        }
        
    });


};

const fetchNews = async () => {
    const news = await newsSchema.find({});
    return news;

}
module.exports = {
    scrapNews,
    fetchNews
}
