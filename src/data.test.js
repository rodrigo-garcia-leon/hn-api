jest.mock('./network');

const { fetchItem, TEST_LIST_TOP, TEST_STORY_22069310 } = require('./network');
const { fetchList, fetchStory } = require('./data');

describe('data', () => {
  afterEach(() => {
    fetchItem.mockClear();
  });

  test('fetchList', async () => {
    const response = await fetchList('top');

    expect(response).toBe(TEST_LIST_TOP);
    expect(fetchItem).toBeCalledTimes(1);
    expect(fetchItem).toBeCalledWith('https://hacker-news.firebaseio.com/v0/topstories.json');
  });

  test('fetchStory', async () => {
    const response = await fetchStory('22069310');

    expect(response).toBe(TEST_STORY_22069310);
    expect(fetchItem).toBeCalledTimes(1);
    expect(fetchItem).toBeCalledWith('https://hacker-news.firebaseio.com/v0/item/22069310.json');
  });
});
