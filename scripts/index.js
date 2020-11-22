fetch('articles.txt')
  .then(data => data.text())
  .then(data => addArticlesToPage(JSON.parse(data)));

const addArticlesToPage = (articles) => {
  const ul = document.querySelector('.article-ol');
  const listItems = articles
    .map((articleData, index) => {
      const source = new URL(articleData.href, location).hostname;

      return `
        <li class="article-li">
          <div class="article-left-col">
            <p class="article-li-number">${index + 1}.</p>
          </div>
          <div class="article-right-col">
            <a class="article-link" href="${articleData.href}">${articleData.title}</a>
            <div class="article-link-details">
              <p class="article-source">${source}</p>
              <p class="article-divide">|</p>
              <button class="article-upvote">upvote <div class="arrow-up article-upvote-icon"></div></button>
              <p class="article-divide">|</p>
              <p class="article-votes">0 votes</p>
            </div>
          </div>
        </li>
      `;
    })
    .join('');

  ul.insertAdjacentHTML('afterbegin', listItems);
};
