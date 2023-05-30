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

let page = 0;
let inputValue = '';

let totalItem = 0;
let totalHits = 0;

ref.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  clearList();
  totalItem = 0
  page = 1;
  if (event.currentTarget.searchQuery.value.length === 0) {
    Notiflix.Notify.failure('Please enter your request');
    return;
  } else {
    const query = event.currentTarget.searchQuery.value;
    inputValue = query;
    const list = await getList(query, page);
    totalHits = list.data.totalHits;
    if (totalItem > 0) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images`);
    }
  }
}

async function getList(query, page) {
  const imgList = await API.getImages(query, page);
  const item = imgList.data.hits;
  totalItem = totalItem + item.length;

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

async function updateList(markup) {
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
    if (totalItem < totalHits) {
      getList(inputValue, page);
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
});

function clearList() {
  ref.gallery.innerHTML = '';
}
