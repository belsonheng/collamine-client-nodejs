// use simplecrawler
var Crawler = require('simplecrawler');

// use form-data and http to connect with CollaMine servers
var FormData = require('form-data');
var http = require('http');

// start crawling
var crawler = Crawler.crawl("http://forums.hardwarezone.com.sg/money-mind-210/");

crawler.interval = 1000;
crawler.timeout = 10000;

var conditionID = crawler.addFetchCondition(function(parsedURL) {
  return parsedURL.path.match(/\.html$/i); //&& (!try_collamine(parsedURL.path));
});

crawler.on("fetchstart", function(queueItem) {
  console.log("Fetching", queueItem.url);
  try_collamine(queueItem.url);
});

crawler.on("fetchcomplete", function(queueItem, responseBuffer, response) {
  console.log("Completed fetching resource:", queueItem.url);
  // if source == original then upload to collamine
  // insert to db
  // responseBuffer.toString();
});

// try downloading the content from CollaMine servers
function try_collamine(url) {
  var COLLAMINE_DOWNLOAD_URL = {
    host: '172.31.22.135',
    port: '9001',
    path: '/download/html/',
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  };

  http.request(COLLAMINE_DOWNLOAD_URL, function(response) {
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
    });
  }).end();
}

// function upload_to_collamine() {
//   var form = new FormData();

//   http.request('http://nodejs.org/images/logo.png', function(response) {
//     form.append('my_field', 'my value');
//     form.append('my_buffer', new Buffer(10));
//     form.append('my_logo', response);
//   });
// }