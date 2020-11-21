const https = require('https');
const $ = require('cheerio');
const fs = require('fs');

const greenWords = require('./green-words.js');

const urls = [
  'https://www.theguardian.com/uk/environment',
  'https://www.theguardian.com/uk/technology',
  'https://www.theguardian.com/science',
  'https://www.bbc.co.uk/news',
  'https://www.bbc.co.uk/news/technology',
  'https://www.bbc.co.uk/news/science_and_environment'
  // 'https://www.dailymail.co.uk/home/index.html'
];

const scrapeData = (url) => {
  return new Promise(function(resolve, reject) {
    https.get(url, (res) => {
      let data = '';

      // a data chunk has been received.
      res.on('data', (chunk) => data += chunk);

      // complete response has been received.
      res.on('end', () => resolve(data));
    }).on('error', (err) => {
      console.log('Error: ' + err.message);
      return reject(err.message);
    });
  });
};

const searchForArticles = (html, baseUrl) => {
  const articles = $('a', html)
    .get()
    .filter(el => greenWords.some(word => $(el).text().toLowerCase().includes(word)));

  const articleLinks = articles.map((el, i) => $(el).attr('href'));

  // const onlyTheLinksWithFullURL = articleLinks;
  // .filter(link => link.match(/^http/)); // @TODO ADD THIS BACK

  // Needed as some links are duplicated onto pages.
  const uniqueArticleData = [...new Set(articleLinks)]
    .map(href => ({
        href: new URL(href, baseUrl),
        title: $(articles.find(article => $(article).attr('href') === href)).text()
    }));

  return uniqueArticleData;
}

Promise.all([...urls.map(url => scrapeData(url))])
  .then(data => {
    const allLinks = data
      .map((html, i) => searchForArticles(html, urls[i]))
      .reduce((a, b) => a.concat(b), []);

    fs.writeFile('articles.txt', JSON.stringify(allLinks), (err) => {
      if (err) return console.log(err);

      console.log('articles.txt updated');
    });
  })
  .catch(console.log);
