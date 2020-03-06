jest.mock('./network');

const fetch = require('node-fetch');
const { TEST_STORY_22069310, TEST_STORY_22089546, TEST_STORY_22089166 } = require('./network');
const { app } = require('./app');

describe('app', () => {
  const PORT = 3000;
  const BASE_URL = `http://localhost:${PORT}/`;

  let server;

  beforeAll(() => {
    server = app.listen(PORT);
  });

  afterAll(done => {
    server.close(done);
  });

  test('health check', async () => {
    const response = await fetch(BASE_URL);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });

  test('list top', async () => {
    const QUERY = `
      {
        list(id: "top", page: 1) {
          stories {
            id
            by
            score
            time
            title
          }
        }
      }
    `;

    const response = await fetch(`${BASE_URL}graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY }),
    });
    const json = await response.json();

    const KEYS = ['id', 'by', 'score', 'time', 'title'];
    const TEST_STORIES = [
      TEST_STORY_22069310,
      TEST_STORY_22089546,
      TEST_STORY_22089166,
    ].map(story => Object.fromEntries(Object.entries(story).filter(([key]) => KEYS.includes(key))));

    expect(json).toStrictEqual({
      data: {
        list: {
          stories: TEST_STORIES,
        },
      },
    });
  });
});
