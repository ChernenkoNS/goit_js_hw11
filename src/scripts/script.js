import API from './api.js';
import 'simplelightbox/dist/simple-lightbox.min.css';
import simpleLightbox from 'simplelightbox';
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
ref.loadMoreButton.addEventListener('click', onLoadMore);

function onSubmit(event) {
  page++;
  event.preventDefault();
  const query = event.currentTarget.searchQuery.value;
  inputValue = query;
  getList(query, page);
}

async function getList(query, page) {
  const imgList = await API.getImages(query, page);
  const markup = imgList.data.hits.reduce(
    (markup, result) => markup + createMarkup(result),
    ' '
  );

  updateList(markup);
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

  
  lightbox.refresh();

}

function createMarkup(item) {
  return `
 
      <div class=" photo-card">
            <a  href="${item.largeImageURL}">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" width="300px"/>
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes <br>${item.likes}</b>
                </p>
                <p class="info-item">
                    <b>Views <br>${item.views}</b>
                </p>
                <p class="info-item">
                    <b>Comments <br>${item.comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads <br>${item.downloads}</b>
                </p>
            </div>
           
        </div>
        
`;
}
function onLoadMore() {
  getList(inputValue, page);
  page++;

}
