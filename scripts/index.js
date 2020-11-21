fetch('articles.txt')
  .then(data => data.text())
  .then(data => addArticlesToPage(JSON.parse(data)));

const addArticlesToPage = (articles) => {
  const ul = document.querySelector('.article-ol');
  const listItems = articles
    .map((articleData, index) => {
      const source = new URL(articleData.href, location).hostname;

      // Need visually hidden 'up vote' and 'down vote' text inside the buttons

      return `
        <li class="article-li">
          <div class="article-left-col">
            <p class="article-li-number">${index + 1}.</p>
            <div class="article-vote-button-wrapper">
              <button class="article-vote-btn arrow-up"><span class="visually-hidden">up vote</span></button>
              <button class="article-vote-btn arrow-down"><span class="visually-hidden">down vote</span></button>
            </div>
          </div>
          <div class="article-right-col">
            <a class="article-link" href="${articleData.href}">${articleData.title}</a>
            <p class="article-source">${source}</p>
          </div>
        </li>
      `;
    })
    .join('');

  ul.insertAdjacentHTML('afterbegin', listItems);
};
