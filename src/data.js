const fetch = require("node-fetch");

const BASE_URL = "https://hacker-news.firebaseio.com/v0/";

const storyMemo = {};

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
const fetchStory = async id => {
  if (Object.keys(storyMemo).includes(id.toString())) {
    return storyMemo[id];
  }

  const result = await fetchItem(`${BASE_URL}item/${id}.json`);
  storyMemo[id] = result;
  return result;
};

module.exports = {
  fetchList,
  fetchStory
};
