jest.mock('node-fetch');

const fetch = require('node-fetch');
const { fetchData } = require('./network');

describe('fetchData', () => {
  let errorSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error');
  });

  afterEach(() => {
    fetch.mockReset();
    errorSpy.mockReset();
  });

  test('ok', async () => {
    fetch.mockReturnValue(Promise.resolve({ json: () => Promise.resolve({ id: 1 }) }));

    const result = await fetchData('url');

    expect(result).toStrictEqual({ id: 1 });
    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith('url');
    expect(errorSpy).toBeCalledTimes(0);
  });

  test('error', async () => {
    fetch.mockReturnValue(() => {
      throw new Error();
    });

    const result = await fetchData('url');

    expect(result).toBeUndefined();
    expect(fetch).toBeCalledTimes(1);
    expect(fetch).toBeCalledWith('url');
    expect(errorSpy).toBeCalledTimes(1);
  });
});
