// (async () => {
//   const resonse = await fetch('https://bbc.co.uk');
//   const text = await resonse.text();
//   console.log(text.match(/(?<=\<h1>).*(?=\<\/h1>)/));
// })()


const https = require('https');
const $ = require('cheerio');
const fs = require('fs');

const greenWords = [
  'wind turbine',
  'wind power',
  'renewable energy',
  'solar power',
  'environment',
  'climate change',
  'green energy',
  'extinction rebellion',
  'greenhouse gas emissions',
  'net zero',
  'climate crisis',
  'buying-ethically',
  'rewilding',
  're-wilding'
];

https.get(url, (resp) => {
  let data = '';

  // a data chunk has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // complete response has been received.
  resp.on('end', () => {
    searchForArticles(data);
  });

}).on('error', (err) => {
  console.log('Error: ' + err.message);
});

const searchForArticles = (html) => {
  const articles = $('a', html)
    .get()
    .filter(el => greenWords.some(word => $(el).text().toLowerCase().includes(word)));

  const articleLinks = articles.map((el, i) => $(el).attr('href'))

  // const articleData = articles
  //   .map((el, i) => ({
  //     href: $(el).attr('href'),
  //     title: $(el).text()
  //   }));


  const onlyTheLinksWithFullURL = articleLinks
    .filter(link => link.match(/^http/));

  // Needed as some links are duplicated onto pages.
  const uniqueArticleData = [...new Set(onlyTheLinksWithFullURL)]
    .map(href => ({
      href,
      title: $(articles.find(article => $(article).attr('href') === href)).text()
    }));

  fs.writeFile('articles.txt', JSON.stringify(uniqueArticleData), (err) => {
    if (err) return console.log(err);

    console.log('articles.txt updated');
  });
}
