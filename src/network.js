const fetch = require('node-fetch');

const fetchData = async url => {
  let json;

  try {
    const response = await fetch(url);
    json = await response.json();
  } catch (error) {
    // eslint-disable-next-line
    console.error(error);
  }

  return json;
};

module.exports = {
  fetchData,
};
