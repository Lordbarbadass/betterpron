const express = require("express");
const app = express();
const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs')
const _range = require('lodash/range');
const _assign = require('lodash/assign');

app.use(express.json());
app.use(express.static("static"));

app.get("/gallery", async (req, res) => {
  try {
    let options = {
      uri: req.query.url,
      qs: { nw: "session" },
      jar: true
    };
    let { from, to } = req.query;

    let images = await getImages(options);

    res.send(images.slice(from - 1, to)); // TODO only request relevant pages
  } catch (error) {
    console.error(error);
    res.json({ error:true, message:error })
  }
});

async function getImages (options) {
  let page = await rp(options);
  let $ = cheerio.load(page);
  let galleryLength = parseInt($("#gdd .gdt2").eq(5).text());
  let imgsPerPage = $(".gdtm").length;
  let nbPages = Math.ceil(galleryLength / imgsPerPage);

  let links = getLinksfromPage($);
  if (nbPages > 1) {
    // send requests and await results
    let promises = _range(1, nbPages).map(i => rp(_assign(options, { qs: { p: i } })))
    let pages = await Promise.all(promises);
    // get links from results
    pages.forEach(page => {
      let $ = cheerio.load(page);
      links = links.concat(getLinksfromPage($));
    });
  }

  let promises = links.map(rp);
  let imgPages = await Promise.all(promises);
  let images = imgPages.map(p => {
    let $ = cheerio.load(p);
    return $("#img").attr("src")
  });

  return images;
}

function getLinksfromPage ($) {
  return $(".gdtm a").map((i, el) => el.attribs.href).toArray();
}

app.listen(process.env.PORT || 3000, () => console.log("Listening on port " + (process.env.PORT || 3000)));
