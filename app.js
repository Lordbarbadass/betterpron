const express = require("express");
const app = express();
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs')

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  let q = req.query.q;
  res.render("index", { url:q });
});

app.get("/gallery", async (req, res) => {
  try {
    // let cache = JSON.parse(fs.readFileSync("cache.json"));
    // if (cache[req.query.url]) {
    //   return res.json({ error:false, images:cache[req.query.url] });
    // }

    let gallery = await rp.get(req.query.url, { qs: { nw: "session" }, jar: true });
    let $ = cheerio.load(gallery);
    let first = $(".gdtm a:first-child").attr("href");
    let images = await getImages(first);
    res.json({ error:false, images });

    // cache[req.query.url] = images;
    // fs.writeFile("cache.json", JSON.stringify(cache, null, 2), () => console.log(`Cached ${req.query.url}`));
  } catch (error) {
    console.error(error);
   res.json({ error:true, message:error }) 
  }
});

async function getImages (url, acc=[]) {
  console.log(`Getting ${url}`);
  
  let page = await rp.get(url);
  let $ = cheerio.load(page);
  let a = $("#i3 a");
  let nextUrl = a.attr("href");
  let img = a.find("img").attr("src");
  acc.push(img);
  if (url !== nextUrl) await getImages(nextUrl, acc);
  return acc;
}

app.listen(process.env.PORT || 3000, () => console.log("Listening on port " + (process.env.PORT || 3000)));