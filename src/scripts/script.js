import API from './api.js';
import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
const lightbox = new simpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  widthRatio: 0.8,
});
const ref = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

let page = 1;
let inputValue = '';
ref.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  clearList();

  page = 1;
  if (event.currentTarget.searchQuery.value.length === 0) {
    Notiflix.Notify.failure('Memento te hominem esse');
    return;
  } else {
    const query = event.currentTarget.searchQuery.value;
    inputValue = query;
    const list = await getList(query, page);
    Notiflix.Notify.info(`Hooray! We found ${list.data.totalHits} images`);
  }
}

async function getList(query, page) {
  const imgList = await API.getImages(query, page);
  const item = imgList.data.hits;
  const markup = item.reduce(
    (markup, result) => markup + createMarkup(result),
    ' '
  );

  if (item.length === 0) {
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  updateList(markup);
  return imgList;
}

function updateList(markup) {
  ref.gallery.insertAdjacentHTML('beforeend', markup);

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  page++;
  lightbox.refresh();
  const lastList = document.querySelector('.photo-card:last-child');
  if (lastList) {
    infiniteObserver.observe(lastList);
  }
}

function createMarkup(item) {
  return `
    <div class="photo-card">
      <a  href="${item.largeImageURL}">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="380px" height="200px"/>
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes </b>
          ${item.likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${item.views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${item.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${item.downloads}
        </p>
      </div>
    </div>
`;
}

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);

    getList(inputValue, page);
  }
});

function clearList() {
  ref.gallery.innerHTML = '';
}
