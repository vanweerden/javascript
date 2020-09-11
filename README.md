# JavaScript Snippets
Node scripts, algorithm practice, etc.

## Files of note:
### news-fetch.js 
- uses NewsAPI to fetch news headlines and prints to the command line
- adding -d option includes descrition of story and clickable url
- usage: 
```
node news-fetch.js (-d) [option]
```
- options:
  abc
  ars
  bbc
  cbc
  globe
  hack
  newsci
  wp
  wsj

### multi-fetch.js 
- similar to news-fetch.js, but allows up to three news sources to be chosen
- Example usage: 
```
node multi-fetch.js abc bbc hack
```
