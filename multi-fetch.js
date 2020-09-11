// Fetches headlines from newsapi and prints to command line
// Added functionality: can include up to three news sources

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

const API_KEY = '1aabcf84f880499295073d5b77ae6b9a';

function getSources(args) {
// Converts command args into array containing valid SOURCE strings
  let input = [];

  // Grab first three command line arguments
  const limit = args.slice(2).length <= 3
              ? args.slice(2).length
              : 3;

  for (let i = 0; i < limit; i++) {
    input.push(process.argv[i + 2]);
  }

  // Validate sources, assign strings for urls, and removes invalid strings
  let sources = input.map( arg => {
    var sourceOK = false;
    for (let i = 0; i < SOURCES.length; i++) {
      if (arg == SOURCES[i][0]) {
        return SOURCES[i][1];
        sourceOK = true;
        break;
      }
    }
  }).filter( src => src != undefined);

  if (sources.length == 0) {
    sources = ['bbc-news', 'abc-news-au', 'cbc-news'];
  }
  return sources;
}

function makeURLs(sources) {
// Takes array of sources strings and creates urls
  let urls = [];
  for (let src of sources) {
    let url = `https://newsapi.org/v2/top-headlines?sources=${src}&apiKey=${API_KEY}`;
    urls.push(url);
  }
  return urls;
}

// Build array of urls to use in https.get() calls
const sources = getSources(process.argv);
const urls = makeURLs(sources);

function printNews(json, index) {
// Takes JSON object and prints headlines
  const articles = json.articles;

  console.log(articles[0].source.name.toUpperCase());
  for (let i = 0; i < articles.length; i++) {
    console.log(i + 1, articles[i].title);
  }
  console.log('\n');
}

const json = [];
let count = 0;

function getJSON(index) {
// Given index of urls array, fetches JSON object and prints headlines
  https.get(urls[index], function(res) {
    res.pipe(bl(function (err, data) {
      if (err) {
        return console.error(err);
      }
      json[index] = JSON.parse(data.toString());
      count++;

      // Once all objects in array, print
      if (count == urls.length) {
        json.forEach( s => printNews(s, index) );
      }
    }));
  });
}

// Cycle through urls
for (let i = 0; i < urls.length; i++) {
  getJSON(i);
}
