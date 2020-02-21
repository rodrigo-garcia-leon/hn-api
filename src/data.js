const fetch = require("node-fetch");

const BASE_URL = "https://hacker-news.firebaseio.com/v0/";

const fetchItem = async url => {
  let json;

  try {
    const response = await fetch(url);
    json = await response.json();
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }

  return json;
};

const fetchList = async id =>
  fetchItem(`${BASE_URL}${id.toLowerCase()}stories.json`);

const fetchStory = async id => fetchItem(`${BASE_URL}item/${id}.json`);

module.exports = {
  fetchList,
  fetchStory
};
