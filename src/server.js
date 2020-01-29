const { buildSchema } = require("graphql");
const Koa = require("koa");
const mount = require("koa-mount");
const graphqlHTTP = require("koa-graphql");
const cors = require("@koa/cors");
const { fetchList, fetchStory } = require("./data");

const PORT = process.env.PORT || 3000;
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

const root = {
  list: async ({ id, page }) => {
    const kids = await fetchList(id);
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = page * PAGE_SIZE;

    const stories = await Promise.all(
      kids.slice(pageStart, pageEnd).map(async id => fetchStory(id))
    );

    return {
      stories
    };
  },
  story: async ({ id }) => fetchStory(id)
};

const app = new Koa();

app.use(cors());

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

app.listen(PORT);
