// Fetches headlines from one source from newsapi and prints to command line
// How to use: node news-fetch (-d) [source]
// -d includes description of story and url

'use strict'
const https = require('https');

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

// Check user input (if any)
const input1 = process.argv[2] ? process.argv[2] : null;
const input2 = process.argv[3] ? process.argv[3] : null;

var src;
var d = false;

// Handle arguments
if (!input1) {
  src = 'bbc';
} else if (input1 == '-d') {
  d = true;
  if (!input2) src = 'bbc';
  else src = input2;
} else src = input1;

// Validate source and assign correct string
var sourceOK = false;
for (let i = 0; i < SOURCES.length; i++) {
  if (src == SOURCES[i][0]) {
    src = SOURCES[i][1];
    sourceOK = true;
    break;
  }
}

// Check if source is legit
if (!sourceOK) {
  console.log('Usage: node news-fetch (-d) [source]');
  console.log('Valid sources: ');
  for (let s of SOURCES) {
    console.log(s[0], `(${s[1]})`);
  }
  return;
}

// Set up url
const API_KEY = '1aabcf84f880499295073d5b77ae6b9a';
const url = `https://newsapi.org/v2/top-headlines?sources=${src}&apiKey=${API_KEY}`;

https.get(url, function(res) {

  const { statusCode } = res;

  let error;
  if (statusCode !== 200) {
    error = new Error ('Request failed.\n' +
                     `Status Code: ${statusCode}`);
  }

  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }

  let body = '';
  // If not set, Buffer objects will be received
  res.setEncoding('utf8');
  // Readable streams emit 'data' events once listener added
  res.on('data', chunk => {
    body += chunk;
  });

  // 'end' event indicates that entire body has been received
  res.on('end', () => {
    try {
      const json = JSON.parse(body);
      const articles = json.articles;

      console.log(articles[0].source.name.toUpperCase());
      for (let i = 0; i < articles.length; i++) {
        console.log(i + 1, articles[i].title);
        // -d option activated
        if (d) {
          console.log(articles[i].description);
          console.log(articles[i].url);
          if (i < articles.length - 1) console.log('--------------------');
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  });
}).on('error', (e) => {
  console.error(e);
});
