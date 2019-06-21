const { previousRelativeMonthDay, getMonthLength, datePad } = require('../utils/time-utils')
const { writeFile, readFile, stat, readdir, unlink } = require('fs');
const { resolve, join } = require('path');
const fetch = require('node-fetch');

const CACHE_PATH = resolve(__dirname, '../cache');

/**
 * Due to the rate limit of the github search API of only 30 request per minuite, This service will provide last months top 3 stars by making the request only once and saving a copy to disk in `/cache`.
 * Uses node fetch as the equivelent of Browser Fetch, should be easy to make isomorphic.
 */
class GithubStarService {
  constructor (date) {
    this._date = date ? new Date(date) : new Date();
    this._selectedDay = this._date.getDate();
    this._selectedMonth = this._date.getMonth();
    this._selectedYear = this._date.getFullYear();
    this._requestStarDataDefaultParams = {
      resultsNumber: 3,
      language: "JavaScript"
    }
  }
  _hasCache (cacheFileName) {
    const PATH = join(CACHE_PATH, `${cacheFileName.replace("..", "--")}.json`);
    return new Promise(resolve => {
      stat(PATH, (err)=>{
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  /**
   * Github has a rate limit of 30 request per minute for non authenticated users
   * caches responses for a given language
   * languageCount request are not cached for security reasons
  */
  async _writeCache (json, path) {
    const toCache = await json;
    return new Promise(resolve => {
      writeFile(path, JSON.stringify(toCache, null, 2), err => {
        if (err) throw err;
        resolve();
      })
    });
  }
  /**
   * Pass a language name to remove old caches with this a language name
   * All caches cannot be deleted at once for safety reasons
   * Ignores dotfiles
   * @param {string} language
   */
  _pergeCache (language) {
    return new Promise(resolve => {
      readdir(CACHE_PATH, (err, directory) => {
        // ignore dot files
        let oldCaches = directory
          .filter(file => file[0] !== ".")
          .filter(file => file.includes(language));
        for(const cacheFile of oldCaches) {
          unlink(join(CACHE_PATH, cacheFile), err => {
            if (err) throw err;
            resolve();
          })
        }
      });
    });
  }
  _readCache (path) {
    return new Promise(resolve => {
      readFile(path, (err, data) => {
        if (err) throw err;
        resolve(JSON.parse(data));
      });
    });
  }
  async response(json, cacheFileName) {
    const PATH = join(CACHE_PATH, `${cacheFileName.replace("..", "--")}.json`);
    if (json === null) {
      return await this._readCache(PATH);
    } else {
      this._writeCache(json, PATH);
      return json;
    }
  }
  /**
   * @param {number} resultsNumber the number of results to retrive.
   * @param {string} language which programing language is the subject of this search
   * @public
   */
  async requestStarData ({ resultsNumber, language } = this._requestStarDataDefaultParams) {
      // default params
    language = language ? language : this._requestStarDataDefaultParams.language;
    resultsNumber = resultsNumber ? resultsNumber : this._requestStarDataDefaultParams.resultsNumber;
    // Do not allow more than 30 results 10x the required.
    const RESULTS_LIMIT = 30;

    // TODO return 01 int for month with 12 as DEC not 11
    const {year, month, day} = this._getLastMonth().next().value;

    const from = {
      year,
      month: datePad(month),
      day: datePad(day)
    }
    const to = {
      year: this._date.getFullYear(),
      month: datePad(this._date.getMonth() + 1),
      day: datePad(this._date.getDate())
    }
    const HOST = 'https://api.github.com/';
    const ENDPOINT = 'search/repositories';
    const MONTH_RANGE = `${from.year}-${from.month}-${from.day}..${to.year}-${to.month}-${to.day}`;

    const params = new URLSearchParams();
    const TOPIC = `q=language:${language}+created:${MONTH_RANGE}`;
    params.append('order', 'desc');
    params.append('per_page', resultsNumber > RESULTS_LIMIT ? RESULTS_LIMIT : resultsNumber);
    params.append('sort', 'stars');

    const URL = `${HOST}${ENDPOINT}?${TOPIC}&${params}`;
    const CACHE_FILE_NAME = `${language}--${MONTH_RANGE}`;
    const cacheExists = await this._hasCache(CACHE_FILE_NAME);

    if (parseInt(resultsNumber) !== 3) {
      const response = await fetch(URL);
      return response.json();
    }
    // go fetch only if no cache is available
    if (!cacheExists) {
      // cleanup past caches
      this._pergeCache(language);
      // replenish cache
      const response = await fetch(URL);
      const responseBody = response.json();
      return this.response(responseBody, CACHE_FILE_NAME);
    } else {
      return this.response(null, CACHE_FILE_NAME);
    }
  }
  /**
   * @generator last months number of month, relative to this month or the next() calls month.
   * @yields an array with number for last month and if called in January, also decrements and provides that year;
   * @private
   */
  * _getLastMonth () {
    const MONTH_MAX = 12;
    const MONTH_MIN = 0;
    const DECREMENT = 1;
    if (this._selectedMonth === MONTH_MIN) {
      this._selectedMonth = MONTH_MAX;
      this._selectedYear -= DECREMENT;
    }
    const relativeMonthDay = previousRelativeMonthDay({
      year: this._selectedYear,
      month: this._selectedMonth,
      day: this._selectedDay
    })
    yield {
      year: this._selectedYear,
      month: this._selectedMonth,
      day: relativeMonthDay
    }
  }
}

module.exports = GithubStarService;