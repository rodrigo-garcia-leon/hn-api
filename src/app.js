const Koa = require('koa');
const mount = require('koa-mount');
const { buildSchema } = require('graphql');
const graphqlHTTP = require('koa-graphql');
const cors = require('@koa/cors');
const winston = require('winston');

const { LoggingWinston } = require('@google-cloud/logging-winston');
const { fetchList, fetchStory } = require('./data');

const app = new Koa();

// logging
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV === 'dev') {
  logger.add(new winston.transports.Console());
} else {
  logger.add(new LoggingWinston());
}

app.use(async (ctx, next) => {
  await next();

  logger.info(JSON.stringify(ctx));
});

// cors
const ACCESS_CONTROL_ALLOW_ORIGIN_DEV = 'http://localhost';
const ACCESS_CONTROL_ALLOW_ORIGIN_PRD = 'https://hn-app.rodrigogarcia.me';

app.use(
  cors({
    'Access-Control-Allow-Origin':
      process.env.NODE_ENV === 'dev'
        ? ACCESS_CONTROL_ALLOW_ORIGIN_DEV
        : ACCESS_CONTROL_ALLOW_ORIGIN_PRD,
  }),
);

// health check
const healthCheck = new Koa();

healthCheck.use(async (ctx, next) => {
  await next();

  ctx.status = 200;
});

app.use(mount('/', healthCheck));

// graphql
const PAGE_SIZE = 30;

const schema = buildSchema(`
  type Query {
    list(id: String, page: Int):  List
    story(id: String): Story
  }

  type List {
    stories: [Story]
  }

  type Story {
    by: String
    descendants: Int
    id: String
    kids: [Int]
    score: Int
    time: Int
    title: String
    type: String
    url: String
  }
`);

const storyMemo = {};

const root = {
  async list({ id, page }) {
    const kids = await fetchList(id);
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = page * PAGE_SIZE;

    const stories = await Promise.all(
      kids.slice(pageStart, pageEnd).map(storyId => this.story({ id: storyId })),
    );

    return {
      stories,
    };
  },
  async story({ id }) {
    if (Object.keys(storyMemo).includes(id.toString())) {
      return storyMemo[id];
    }

    const result = await fetchStory(id);
    storyMemo[id] = result;

    return result;
  },
};

app.use(
  mount(
    '/hn-api/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    }),
  ),
);

function run() {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
}

if (require.main === module) {
  run();
}

module.exports = {
  app,
};
