const { config } = require('./package.json');
const { resolve, join } = require('path');
const GithubStarService = require('./services/github-star-service');

const express = require('express')
const app = express();

// True constants
const PORT = config.server.port;
const TEMPLATES_PATH = resolve(__dirname, 'public');

app.use('/script', express.static(join(__dirname, 'public', 'script')));

app.get('/', (req, res) => {
  res.redirect('/JavaScript')
});

app.get('/:language/:resultsNumber?', (req, res) => {
  res.sendFile(resolve(TEMPLATES_PATH, 'index.html'));
});

app.get('/api/:language/:resultsNumber?', async (req, res) => {
  const stars = new GithubStarService();
  let { language, resultsNumber } = req.params;

  if (!resultsNumber) {
    resultsNumber = 3;
  }

  if (resultsNumber > 30) {
    res.status(405); // Not allowed, but the GithubStarService has clamped results to 30 anyway.
    res.send(`Requested results ${resultsNumber} is greater than the max permited 30, this request was not permitted.`);
  } else {
    const results = await stars.requestStarData({
      language,
      resultsNumber
    });
    res.json(results);
  }
});

app.listen(PORT, () => console.log(`server is listening on ${PORT}`))