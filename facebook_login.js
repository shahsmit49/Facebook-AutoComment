const puppeteer = require('puppeteer');
const jsdom = require("jsdom")
const {JSDOM} = jsdom
global.DOMParser = new JSDOM().window.DOMParser

const isHeadless = false


async function scroll(page, scrollDelay = 1000) {
    let previousHeight;
    try {
        while (mutationsSinceLastScroll > 0 || initialScrolls > 0) {
            mutationsSinceLastScroll = 0;
            initialScrolls--;
            previousHeight = await page.evaluate(
                'document.body.scrollHeight'
            );
            await page.evaluate(
                'window.scrollTo(0, document.body.scrollHeight)'
            );
            await page.waitForFunction(
                `document.body.scrollHeight > ${previousHeight}`,
                {timeout: 600000}
            ).catch(e => console.log('scroll failed'));
            await page.waitFor(scrollDelay);
        }
    } catch (e) {
        console.log(e);
    }
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}




async function logIn(page) {

    await page.goto('https://www.facebook.com/',
        {waitUntil: 'networkidle2'})

    await page.waitForSelector('input[name="email"]')
    //enter email password
    await page.type('input[name="email"]', "shahsmit49@gmail.com")
    await page.type('input[name="pass"]', "$Nayna3017227")


    await page.click('label[id=loginbutton]')

    await page.waitForSelector('span[class="imgWrap"]')


    if(await page.$("#userNavigationLabel") !== null) {
        await page.$("#userNavigationLabel")
        //post link of temp2 group
        await page.goto('https://www.facebook.com/groups/1481557328643107/permalink/1587155664749939/', {
          waitUntil: 'networkidle2'
        });
        // await page.click("#_5rp7");
        await page.evaluate(() => {
          let elements = document.getElementsByClassName('_7c-t');
          for (let element of elements)
              element.click();
              
        });
        //commenting on post
        await page.keyboard.type('test');
        await page.keyboard.press('Enter');
    }
    await page.waitFor(3000);
    try {
        await page.focus('._1t9_._7ja_');
        await page.keyboard.press('Enter');
        await page.keyboard.press('\n');
        await page.keyboard.press('\r');
        await page.waitFor(3000);
        const inputUploadHandle = await page.$('input[type=file]');
        console.log(inputUploadHandle);
        let fileToUpload = 'download.jpeg';
        inputUploadHandle.uploadFile(fileToUpload);
        //waiting to complete image uploading
        await page.waitFor(5000);
        await page.evaluate(() => {
            let elements = document.getElementsByClassName('_1p1t');
            for (let element of elements)
                element.click();
                
        });
        await page.keyboard.press('Enter');
    } catch (error) {
        console.log(error);
    }

}

async function goToPage(page, pageName) {

    await page.goto("https://m.facebook.com/" + pageName + "/",
        {waitUntil: 'networkidle2'})

//await scroll(page)
    await page.waitForSelector('div[data-nt="NT:BOX_3"]')
}




exports.gotopage = async function(){
    pagename = "goodrx"
    const browser = await puppeteer.launch({headless: isHeadless,args:['--allow-file-access-from-file']})
    const page = await browser.newPage()


    await page.setViewport({width: 1280, height: 800})


    await logIn(page)

    await goToPage(page, pageName)
}


