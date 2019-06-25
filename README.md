[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Build Status](https://travis-ci.org/acronamy/github-star.svg?branch=master)](https://travis-ci.org/acronamy/github-star)

# Github star

Displays the top 3 highest stared reops of a given language of this given month, using Node.js express app serving a cached resposes to a React app via Redux.

For a full description see the Design notes section at the end of this README.

### Building
- `npm i`
- `npm run build`
- `npm run preview-serve`
- Go to http://localhost:3030 in your browser.

### Urls

Access the API

`/api/:language/:count`

Where `language` referes to any language understood by Github Search API.

Where `count` referes to the numer of request - (optional)

Note that you cannot request larger than 30 items and the frontend does not impliment this feature due to time constraints. - premiture optimization perhaps and in hindsight I should have left this out.

`/`

The root redirects to `/JavaScript`

`/:language`
Displays the top 3 highest stared reops of a given language of this given month.

## Testing
Each package in this repo has its own test suite employing [Jest](https://github.com/facebook/jest).

[Puppeteer](https://github.com/GoogleChrome/puppeteer) has been mixed into Jest to make an acceptance test framework, this checks the structure of the application is intact.

### Tasks
*From root:*

`npm run test`

Run Jest and Puppeteer wrapped in Jest. Automated tests include acceptance test and unit tests.

`npm run build`

Run fuse to bundle the app, copy assets, etc.

`npm run preview-serve`

Start the backend from the build directory

`npm run dev-serve`

Start the backend on port `:3030` prebuilt

`npm run lint-browser-fix` | `npm run lint-node-fix` | `npm run lint-browser-ci` | `npm run lint-node-ci`

eslint has been setup, scsslint has not due to the lack of styling required to meet the wireframe. For this project I have focused on testing and delivering functional code over [creativity](https://codepen.io/acronamy/).

`npm run clean`

Runs learna clean to clean all packages and dependencies.

`npm postinstall`

After installing, postinstall runs `npm i ./packages/*`, unfortunatly lerna wont run correctly in Travis so this takes responsibility.

---
*From package:*

Most packages contain tests suites which can run independently but a dev or preview server must be running on port `:3030`

### Repo notes
This repo is managed by lerna, to find out more about monorepos check this out: https://hackernoon.com/one-vs-many-why-we-moved-from-multiple-git-repos-to-a-monorepo-and-how-we-set-it-up-f4abb0cfe469

### Design notes
#### Backend
A [node.js](https://nodejs.org/en/) backend, containing a single [isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application) service which fetches details about a given language from the top 3 (although more are possible) in the last relative month from today.

Why couldnt this application be a cache using clientside technologies (cookies, local / session storage, indexdb)? Unfortunately for us the Github API for anonamous requests is limited to only 10 requests per minute - if say, this application featured on some popular tech blog, you would find out very quickly that without a cache, the application would fail to return data even in low traffic.

That wont do, so what can be done? I could have handled this issue clientside which fixes returning visits, but this does not stop those 10 request from happening, we need to brind this request down too 1 request per day - this could have been 1 request per month if the date range was not relative.


A serverside JSON cache is managed per language depending a coule of questions, does a cache need to be created today for this language? Is the request for a custom number of results? (to prevent 2 attack vectors, custom sized reques are never cached, you may not request for more than 30 items). Caches are cleaned up if a request is mode for them, there is no cron like behavior.

#### Frontend
Based on the nature of the API and the Backend produced to handle this, the Frontend has very little state to manage. written in JavaScript (es6), I have used React as a renderer with Redux (I realize that this is not really an application needing Redux but for demonstration purposes it's fine).

I think of components as tiny grains of sand to make a beach. Components should be easy to re-use, agnostic of data, in other words dumb where posible, most importantly they should do one thing well. My initial intention was to nest building blocks of components but as time ran thin, I was able to strike a compromise with the use of more props than I would have liked.