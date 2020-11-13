fetch('articles.txt')
  .then(data => data.text())
  .then(data => addArticlesToPage(JSON.parse(data)));

const addArticlesToPage = (articles) => {
  const ul = document.querySelector('.article-ul');
  const listItems = articles
    .map(articleData => {
      const source = new URL(articleData.href, location).hostname;

      return `
        <li>
          <a href="${articleData.href}">${source} - ${articleData.title}</a>
        </li>
      `;
    })
    .join('');

  ul.insertAdjacentHTML('afterbegin', listItems);
};
