const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require('express-rate-limit');

const app = express();

const db = monk(process.env.MONGO_URI || 'localhost/tweedle'); // connect to mongodb
const tweeds = db.get('tweeds'); // get collection tweeds
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Tweedledee... or Tweedledum?🤨',
  });
});

app.get('/tweeds', (req, res) => {
  tweeds.find().then((tweeds) => {
    res.json(tweeds);
  });
});

function isValidTweed(tweed) {
  return (
    tweed.name &&
    tweed.name.toString().trim() !== '' &&
    tweed.content &&
    tweed.content.toString().trim() !== ''
  );
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

app.post('/tweeds', (req, res) => {
  if (isValidTweed(req.body)) {
    // insert into db...
    const tweed = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };

    tweeds.insert(tweed).then((createdTweed) => {
      res.json(createdTweed);
    });
  } else {
    res.status(422);
    res.json('Hey! Name and Content are required!');
  }
});

app.listen(5000, () => {
  console.log('Listening on https://localhost:5000');
});
