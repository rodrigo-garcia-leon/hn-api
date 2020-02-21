const { buildSchema } = require("graphql");
const Koa = require("koa");
const mount = require("koa-mount");
const graphqlHTTP = require("koa-graphql");
const cors = require("@koa/cors");
const { fetchList, fetchStory } = require("./data");

const app = new Koa();

// cors
const ACCESS_CONTROL_ALLOW_ORIGIN_DEV = "http://localhost";
const ACCESS_CONTROL_ALLOW_ORIGIN_PRD = "https://react-hnpwa.rodrigogarcia.me";

app.use(
  cors({
    "Access-Control-Allow-Origin":
      process.env.NODE_ENV === "PRD"
        ? ACCESS_CONTROL_ALLOW_ORIGIN_PRD
        : ACCESS_CONTROL_ALLOW_ORIGIN_DEV
  })
);

// health check
const healthCheck = new Koa();

healthCheck.use(async function(ctx, next) {
  await next();
  ctx.status = 200;
});

app.use(mount("/", healthCheck));

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
  list: async function ({ id, page }) {
    const kids = await fetchList(id);
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = page * PAGE_SIZE;

    const stories = await Promise.all(
      kids.slice(pageStart, pageEnd).map(storyId => this.story({ id: storyId }))
    );

    return {
      stories
    };
  },
  story: async function ({ id }) {
    if (Object.keys(storyMemo).includes(id.toString())) {
      return storyMemo[id];
    }

    const result = await fetchStory(id);
    storyMemo[id] = result;
    return result;
  }
};

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true
    })
  )
);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
