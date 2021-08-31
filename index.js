           
          /*
           How it is working...
           load page then get main title and main image url
           again get all related titltes and images url

           create folder with date...if already exist then dont create folder
           for new day new folder with date, for each day one csv with all titiles and web urls...
           all images with title name will be in same date fodler....
          */
          var fs = require("fs");
          const ObjectsToCsv = require("objects-to-csv");
          const neatCsv = require("neat-csv");
          request = require('request')
           
          const puppeteer = require('puppeteer');
          const tw = require('./tweet');
          const io = require('./dataio');

          module.exports.main = async function main() {
            // (async function main() {
              try {
                const browser = await puppeteer.launch();
                const [page] = await browser.pages();
        
                await page.goto('https://www.dailymail.co.uk/sport/transfernews/index.html', { waitUntil: 'networkidle0',timeout: 0 });
                const main_title = await page.evaluate(() => document.querySelector('.article-large > .linkro-darkred > a').innerHTML);
                // console.log("Main title",main_title);
                const main_img_adress = await page.evaluate(() => document.querySelector('.article-large > a >img').getAttribute("src"));
                // console.log("Main head img address",main_img_adress)
                
                const innerHeads_img = await page.evaluate(() => {
                    var alltitles=[];
                    alltitles = Array.from(document.querySelectorAll('.article-small > .linkro-darkred > a'));
                    var relatedTitles=alltitles.map(a => a.innerText);

                    var allimages=[];
                    allimages = Array.from(document.querySelectorAll('.article-small > a > img'));
                    var related_images=allimages.map(img => img.getAttribute("src"));
                             return {related_title:relatedTitles,related_image:related_images};
                       });

                // console.log(innerHeads_img.related_image)
                await browser.close();


                var data=[];
                var d = new Date();
                var date = d.getDate();
                var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                var year = d.getFullYear();
                var preLink = date + "-" + month + "-" + year; 
               
                data.push({title:main_title,img_address:main_img_adress,img_no:"./"+preLink+"/top.jpg"});

                io.download(main_img_adress,"top", function(){
                              
                });
                
                for(let i=0;i<innerHeads_img.related_title.length;i++){
                    data.push({title:innerHeads_img.related_title[i],img_address:innerHeads_img.related_image[i],img_no:"./"+preLink+i+".jpg"});
                }
                
                console.log(data);

                let res=await io.writestats(data);
                if(res=="ok"){
                    for(let i=0;i<innerHeads_img.related_title.length;i++){
                        // await io.downloadimages(innerHeads_img.related_image[i],innerHeads_img.related_title[i]);
                        io.download(innerHeads_img.related_image[i],i, function(){
                              
                            });
                    }
                }else
                console.log("....")


              
          

                
                // Start Sending Tweets
                await delay(2000); //wait to complete all transation
                let data_o = [];
                data_o = fs.readFileSync("./"+preLink+"/"+preLink+".csv");
                let all_data= await neatCsv(data_o);
                // await tw.sendTweets();
                 for(let i=0;i<all_data.length;i++){
                 console.log("title:---",all_data[i].title,"Img dir name",all_data[i].img_no);
                   await tw.sendTweets(all_data[i].title,all_data[i].img_no);
                   await delay(7000);
              }

                





              function delay(delayInms) {
                return new Promise(resolve => {
                  setTimeout(() => {
                    resolve(2);
                  }, delayInms);
                });
              }
              
            



              } catch (err) {
                console.error(err);
              }
            }