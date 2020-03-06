const fetch = require("node-fetch");

const fetchItem = async url => {
  let json;

  try {
    const response = await fetch(url);
    json = await response.json();
  } catch (error) {
    console.error(error);
  }

  return json;
};

module.exports = {
  fetchItem
};
