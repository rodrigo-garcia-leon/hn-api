jest.mock('./network');

const { fetchData, TEST_LIST_TOP, TEST_STORY_22069310 } = require('./network');
const { fetchList, fetchItem } = require('./data');

describe('data', () => {
  afterEach(() => {
    fetchData.mockClear();
  });

  test('fetchList', async () => {
    const response = await fetchList('top');

    expect(response).toBe(TEST_LIST_TOP);
    expect(fetchData).toBeCalledTimes(1);
    expect(fetchData).toBeCalledWith('https://hacker-news.firebaseio.com/v0/topstories.json');
  });

  test('fetchItem', async () => {
    const response = await fetchItem(22069310);

    expect(response).toBe(TEST_STORY_22069310);
    expect(fetchData).toBeCalledTimes(1);
    expect(fetchData).toBeCalledWith('https://hacker-news.firebaseio.com/v0/item/22069310.json');
  });
});
