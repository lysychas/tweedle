console.log('Hello world!');

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const tweedsElement = document.querySelector('.tweeds');
const API_URL = 'http://localhost:5000/tweeds';

loadingElement.style.display = '';

listAllTweeds();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get('name');
  const content = formData.get('content');

  const tweed = {
    name,
    content,
  };

  form.style.display = 'none';
  loadingElement.style.display = '';

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(tweed),
    headers: { 'content-type': 'application/json' },
  })
    .then((response) => response.json())
    .then((createdTweed) => {
      console.log(createdTweed);
      form.reset();
      setTimeout(() => {
        form.style.display = '';
      }, 3000);

      listAllTweeds();
    });
});

function listAllTweeds() {
  tweedsElement.innerHTML = '';
  fetch(API_URL)
    .then((response) => response.json())
    .then((tweeds) => {
      console.log(tweeds);
      tweeds.reverse();
      tweeds.forEach((tweed) => {
        const div = document.createElement('div');

        const header = document.createElement('h3');
        header.textContent = tweed.name;

        const contents = document.createElement('p');
        contents.textContent = tweed.content;

        const date = document.createElement('small');
        date.textContent = new Date(tweed.created);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        tweedsElement.appendChild(div);
      });
      loadingElement.style.display = 'none';
    });
}
