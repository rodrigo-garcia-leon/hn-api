const TEST_LIST_TOP = [22069310, 22089546, 22089166];
const TEST_STORY_22069310 = {
  by: 'evolve2k',
  descendants: 129,
  id: 22069310,
  kids: [22632066],
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
  id: 22089546,
  kids: [],
  score: 67,
  time: 1579409698,
  title: 'GCC: C++ coroutines – Initial implementation pushed to master',
  type: 'story',
  url: 'https://gcc.gnu.org/ml/gcc-patches/2020-01/msg01096.html',
};
const TEST_STORY_22089166 = {
  by: 'pseudolus',
  descendants: 30,
  id: 22089166,
  kids: [],
  score: 66,
  time: 1579403758,
  title: "Maine's giant spinning ice disc looks like it's reforming",
  type: 'story',
  url:
    'https://www.theguardian.com/us-news/2020/jan/19/maines-giant-spinning-ice-disc-looks-like-its-reforming',
};
const TEST_COMMENT_22632066 = {
  by: 'rococode',
  id: 22632066,
  kids: [22632198],
  parent: 22630665,
  text:
    'I&#x27;ve been having major internet issues lately (Seattle area), have had 4 techs come try to figure it out. Yesterday&#x27;s tech finally correctly diagnosed the problem as happening before the connection reaches our home but was unsure of the cause. He called his supervisor to investigate, and they found that the capacity for our neighborhood&#x27;s node was nearly at 100%, while ideally it should always be under 80%. Fortunately they said they&#x27;ll be able to fix it within a few weeks by doing a node split. The tech mentioned he&#x27;d never heard of capacity issues before in his ~20 years as a tech and that some smaller ISPs have been having issues keeping their internet up and running at all.<p>I&#x27;ve been tracking the performance with PingPlotter, if you&#x27;re curious how bad it is right now here&#x27;s the last 10 minutes: <a href="https:&#x2F;&#x2F;i.imgur.com&#x2F;AnUqv3j.png" rel="nofollow">https:&#x2F;&#x2F;i.imgur.com&#x2F;AnUqv3j.png</a> (red lines are packet loss) Pretty interesting how current circumstances are pushing even tried and tested infrastructure to their limits.',
  time: 1584654093,
  type: 'comment',
};
const TEST_COMMENT_22632198 = {
  by: 'texthompson',
  id: 22632198,
  kids: [],
  parent: 22632066,
  text:
    'If you didn&#x27;t know, that 80% number is probably the result of Little&#x27;s Law. That&#x27;s the result where if your demand is generated by a Poisson process, and your service has a queue, 80% utilization of the service is where the probability of an infinite queue starts to get really high. People<p>Here&#x27;s a nice blog post about the subject:<p><a href="https:&#x2F;&#x2F;www.johndcook.com&#x2F;blog&#x2F;2009&#x2F;01&#x2F;30&#x2F;server-utilization-joel-on-queuing&#x2F;" rel="nofollow">https:&#x2F;&#x2F;www.johndcook.com&#x2F;blog&#x2F;2009&#x2F;01&#x2F;30&#x2F;server-utilization...</a>',
  time: 1584655171,
  type: 'comment',
};
const TEST_DATA_URLS = {
  'https://hacker-news.firebaseio.com/v0/topstories.json': TEST_LIST_TOP,
  'https://hacker-news.firebaseio.com/v0/item/22069310.json': TEST_STORY_22069310,
  'https://hacker-news.firebaseio.com/v0/item/22089546.json': TEST_STORY_22089546,
  'https://hacker-news.firebaseio.com/v0/item/22089166.json': TEST_STORY_22089166,
  'https://hacker-news.firebaseio.com/v0/item/22632066.json': TEST_COMMENT_22632066,
  'https://hacker-news.firebaseio.com/v0/item/22632198.json': TEST_COMMENT_22632198,
};

function queryCommentResult(kids, addTypename) {
  const KEYS = ['id', 'by', 'time', 'text'];
  const TEST_COMMENTS = {
    '22632066': TEST_COMMENT_22632066,
    '22632198': TEST_COMMENT_22632198,
  };

  return kids.map(id => {
    const initialComment = TEST_COMMENTS[id.toString()];
    const comment = Object.fromEntries(
      Object.entries(initialComment).filter(([key]) => KEYS.includes(key)),
    );

    if (initialComment.kids && initialComment.kids.length) {
      comment.comments = queryCommentResult(initialComment.kids);
    }

    if (addTypename) {
      comment.__typename = 'Comment';
    }

    return comment;
  });
}

const fetchData = jest.fn().mockImplementation(url => TEST_DATA_URLS[url]);

function queryListResult(initialStories, addTypename = false) {
  const KEYS = ['id', 'by', 'score', 'time', 'title'];

  const stories = initialStories
    .map(story => Object.fromEntries(Object.entries(story).filter(([key]) => KEYS.includes(key))))
    .map(story => (addTypename ? { __typename: 'Story', ...story } : story));
  const list = {
    stories,
  };

  if (addTypename) {
    list.__typename = 'List';
  }

  return {
    data: {
      list,
    },
  };
}

function queryStoryResult(initialStory, addTypename = false) {
  const KEYS = ['id', 'title'];
  const story = Object.fromEntries(
    Object.entries(initialStory).filter(([key]) => KEYS.includes(key)),
  );

  story.comments = queryCommentResult(initialStory.kids, addTypename);

  if (addTypename) {
    story.__typename = 'Story';
  }

  return {
    data: {
      story,
    },
  };
}

module.exports = {
  TEST_LIST_TOP,
  TEST_STORY_22069310,
  TEST_STORY_22089546,
  TEST_STORY_22089166,
  fetchData,
  queryListResult,
  queryStoryResult,
};
