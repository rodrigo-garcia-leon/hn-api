const { fetchItem } = require('./utils');

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

const fetchList = async id => fetchItem(`${BASE_URL}${id.toLowerCase()}stories.json`);
const fetchStory = async id => fetchItem(`${BASE_URL}item/${id}.json`);

module.exports = {
  fetchList,
  fetchStory,
};
