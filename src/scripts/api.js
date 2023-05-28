import axios from 'axios';

const URL = 'https://pixabay.com/api/';

const KEY = '36761319-d149b7033a361911a7c88355b';

function getImages(query, page) {
  try {
    return axios.get(
      `${URL}?key=${KEY}&q=${query}&image_type=photo&per_page=40&page=${page}&orientation=horizontal&safesearch=true`
    );
  } catch (error) {
    console.log('qweqweqweqeqwe');
  }
}
export default { getImages };
