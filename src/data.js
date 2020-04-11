const { fetchData } = require('./network');

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

const fetchList = async id => fetchData(`${BASE_URL}${id.toLowerCase()}stories.json`);
const fetchItem = async id => fetchData(`${BASE_URL}item/${id}.json`);

module.exports = {
  fetchList,
  fetchItem,
};
