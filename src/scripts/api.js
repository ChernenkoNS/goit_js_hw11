import axios from 'axios';
import Notiflix from 'notiflix';

const URL = 'https://pixabay.com/api/';

const KEY = '36761319-d149b7033a361911a7c88355b';

function getImages(query, page) {
  return axios
    .get(
      `${URL}?key=${KEY}&q=${query}&image_type=photo&per_page=40&page=${page}&orientation=horizontal&safesearch=true`
    )
    .then(res => res)
    .catch(error => {
      console.log('EROR');
      Notiflix.Notify.failure('ERROR');
    });
}
export default { getImages };
