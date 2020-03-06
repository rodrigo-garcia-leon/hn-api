const TEST_LIST_TOP = [22069310, 22089546, 22089166];
const TEST_STORY_22069310 = {
  by: 'evolve2k',
  descendants: 129,
  id: '22069310',
  kids: [
    22070253,
    22070399,
    22069720,
    22069924,
    22069998,
    22070022,
    22070557,
    22070877,
    22069869,
    22072077,
    22070962,
    22071291,
    22071045,
    22069824,
    22070426,
    22069841,
    22069991,
    22070042,
    22069723,
    22071185,
    22071234,
    22069881,
  ],
  score: 379,
  time: 1579211054,
  title: 'BlackRock’s decision to dump coal signals what’s next',
  type: 'story',
  url:
    'https://theconversation.com/blackrock-is-the-canary-in-the-coalmine-its-decision-to-dump-coal-signals-whats-next-129972',
};
const TEST_STORY_22089546 = {
  by: 'matt_d',
  descendants: 14,
  id: '22089546',
  kids: [22089792, 22089957],
  score: 67,
  time: 1579409698,
  title: 'GCC: C++ coroutines – Initial implementation pushed to master',
  type: 'story',
  url: 'https://gcc.gnu.org/ml/gcc-patches/2020-01/msg01096.html',
};
const TEST_STORY_22089166 = {
  by: 'pseudolus',
  descendants: 30,
  id: '22089166',
  kids: [22089854, 22090026, 22089526, 22089414, 22089463],
  score: 66,
  time: 1579403758,
  title: "Maine's giant spinning ice disc looks like it's reforming",
  type: 'story',
  url:
    'https://www.theguardian.com/us-news/2020/jan/19/maines-giant-spinning-ice-disc-looks-like-its-reforming',
};
const TEST_ITEMS = {
  'https://hacker-news.firebaseio.com/v0/topstories.json': TEST_LIST_TOP,
  'https://hacker-news.firebaseio.com/v0/item/22069310.json': TEST_STORY_22069310,
  'https://hacker-news.firebaseio.com/v0/item/22089546.json': TEST_STORY_22089546,
  'https://hacker-news.firebaseio.com/v0/item/22089166.json': TEST_STORY_22089166,
};

const fetchItem = jest.fn().mockImplementation(url => TEST_ITEMS[url]);

module.exports = {
  TEST_LIST_TOP,
  TEST_STORY_22069310,
  TEST_STORY_22089546,
  TEST_STORY_22089166,
  fetchItem,
};