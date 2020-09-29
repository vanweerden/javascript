// Fetches headlines from newsapi.org and prints to command line
// Added functionality: can include up to three news sources
// Usage:

'use strict'
const https = require('https');
const bl = require('bl');

// [command, source]
const SOURCES = [
  ['abc', 'abc-news-au'],
  ['ars', 'ars-technica'],
  ['bbc', 'bbc-news'],
  ['cbc', 'cbc-news'],
  ['globe', 'the-globe-and-mail'],
  ['hack', 'hacker-news'],
  ['newsci', 'new-scientist'],
  ['wp', 'the-washington-post'],
  ['wsj', 'the-wall-street-journal'],
];

// TODO: hide this
const API_KEY = '1aabcf84f880499295073d5b77ae6b9a';

// TODO: make this more elegant
function printNews() {
  let userInput = getCommandLineArgs();
  let sources = getFullSourceNames(userInput);
  let urls = buildURLsFrom(sources);
  let json = fetchAllJSON(urls);
}

function getCommandLineArgs() {
  let args = process.argv;
  let input = [];
  // Ignores arguments after third
  const limit = args.slice(2).length <= 3
              ? args.slice(2).length
              : 3;

  for (let i = 0; i < limit; i++) {
    input.push(args[i + 2]);
  }
  return input;
}

function getFullSourceNames(userInput) {
  let sources;
  if (userInput.length == 0) {
    sources = ['bbc-news', 'abc-news-au', 'cbc-news'];
  } else {
    // TODO: make this more efficient (iterates through SOURCES for each argument)
    sources = userInput.map( (arg) => {
      var sourceOK = false;
      for (let i = 0; i < SOURCES.length; i++) {
        if (arg == SOURCES[i][0]) {
          return SOURCES[i][1];
          sourceOK = true;
          break;
        }
      }
    }).filter( (src) => src != undefined);
  }
  return sources;
}

function buildURLsFrom(sources) {
// Takes array of sources strings and creates urls
  let urls = [];
  for (let src of sources) {
    let url = `https://newsapi.org/v2/top-headlines?sources=${src}&apiKey=${API_KEY}`;
    urls.push(url);
  }
  return urls;
}

async function fetchAllJSON(urls) {
  let json = [];
  for (let i = 0; i < urls.length; i++) {
    let result = await fetchJSONFrom(urls[i]);
    json.push(result);
  }
}

// TODO: refactor this. Separate fetching and printing
function fetchJSONFrom(url) {
  // make https get call
  https.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        const json = JSON.parse(rawData);
        printHeadlines(json);
      } catch (e) {
        console.error(e.message);
      }
    })
  }).on('error', (e) => {
    console.error(e.message);
  })
}

// TODO: make headlines into links before printing
function printHeadlines(json) {
  const articles = json.articles;

  console.log(articles[0].source.name.toUpperCase());
  for (let i = 0; i < articles.length; i++) {
    console.log(i + 1, articles[i].title);
  }
  console.log('\n');
}

printNews();
