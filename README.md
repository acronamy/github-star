[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# Github star

### Repo
About monorepo style repos: https://hackernoon.com/one-vs-many-why-we-moved-from-multiple-git-repos-to-a-monorepo-and-how-we-set-it-up-f4abb0cfe469

### Testing
Each package in this repo has its own test suite employing [Jest](https://github.com/facebook/jest).

[Puppeteer](https://github.com/GoogleChrome/puppeteer) has been mixed into jest to make an acceptance test framework, this checks the structure of the application is intact.

### Tasks

*From root:*

`npm run test`
