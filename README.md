[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Build Status](https://travis-ci.org/acronamy/github-star.svg?branch=master)](https://travis-ci.org/acronamy/github-star)

# GitHub star

Displays the top 3 highest stared reops of a given language of this given month, using Node.js express app serving a cached response to a React app via Redux.

For a full description see the Design notes section at the end of this README.

### Building
- `npm i`
- `npm run build`
- `npm run preview-serve`
- Go to http://localhost:3030 in your browser.

### URLs

Access the API

`/api/:language/:count`

Where `language` refers to any language understood by GitHub Search API.

Where `count` refers to the number of request - (optional)

Note that you cannot request larger than 30 items and the frontend does not implement this feature due to time constraints. - premature optimization perhaps and in hindsight I should have left this out.

`/`

The root redirects to `/JavaScript`

`/:language`
Displays the top 3 highest stared reops of a given language of this given month.

## Testing
Each package in this repo has its own test suite employing [Jest](https://github.com/facebook/jest).

[Puppeteer](https://github.com/GoogleChrome/puppeteer) has been used in Jest to form an acceptance test system, this checks the structure of the application is intact.

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

eslint has been setup, scsslint has not due to the lack of styling required to meet the wireframe. For this project I have focused on testing and delivering functioning code over [creativity](https://codepen.io/acronamy/).

`npm run clean`

Runs lerna clean to clean all packages and dependencies.

`npm postinstall`

After installing, postinstall runs `npm i ./packages/*`, unfortunately Lerna won’t run correctly in Travis so this command takes the responsibility.

---
*From package:*

Most packages contain tests suites which can run individually however, a dev or preview server must be running on port `:3030`

### Repo notes
This repo is managed by lerna, to find out more about monorepos check this out: [This Hackernoon post](https://hackernoon.com/one-vs-many-why-we-moved-from-multiple-git-repos-to-a-monorepo-and-how-we-set-it-up-f4abb0cfe469)

All work carried out on master branch with a non-branching strategy.

### Design notes
#### Backend
A [node.js](https://nodejs.org/en/) backend, containing a single [isomorphic](https://www.lullabot.com/articles/what-is-an-isomorphic-application) service which fetches details about a given language from the top 3 (although more are possible) in the last relative month from today.

Why couldn’t this application use caching with clientside technologies (cookies, local / session storage, indexdb)? Unfortunately for me the GitHub API for anonymous requests is limited to only 10 requests per minute (30 if authenticated) - if say, this application featured on some popular tech blog, you would find out very quickly that without a cache, the application would fail to return data even in low traffic.

That won’t do, so what can be done? I could have handled this issue clientside but it would not solve the whole problem, returning visitors would have a cache and no further request would be made, but this does not stop those 10 requests from happening initially, we need to bring this request down too 1 request per day - this could have been 1 request per month if the date range was not relative (a moving target).


A JSON cache is managed serverside per language depending a few conditions; 
- does a cache need to be created today for this language? 
- Is the request for a custom number of results? (to prevent 2 attack vectors, custom sized requests are never cached, you may not request for more than 30 items). 
- Previous caches are cleaned up if a request is mode for new day with a given language if the old cache exists at all. This is more reliable than cron like behaviour.

#### Frontend
Based on the nature of the API and the Backend produced to handle various considerations, the Frontend has very little state to manage. Written in JavaScript (es6), I have used React as a renderer with Redux (I realize that this is not really an application needing Redux but for demonstration purposes it's fine).

My initial intention was to nest building tiny blocks of components but as time ran thin, I was able to strike a compromise with the use of more props than I would have liked. In an ideal world, components would be the size of buttons and text elements on a page, the concept is similar to atomic web design or polymer.

#### Final thoughts
I have had a lot of fun, challenges and compromise to make this happen, the work took 8 days and probably would have been completed faster if it had not been for responsibilities.
Thank you for checking it out :D
