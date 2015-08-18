// use simplecrawler
var Crawler = require('simplecrawler');

// use form-data and http to connect with CollaMine servers
var FormData = require('form-data');
var http = require('http');

// start crawling
var crawler = Crawler.crawl("http://forums.hardwarezone.com.sg/money-mind-210/");

crawler.interval = 1000;
crawler.timeout = 10000;

// only fetch html documents
crawler.addFetchCondition(function(parsedURL) {
  return parsedURL.path.match(/\.html$/i);
});

// before fetch starts, check if doc exists in collamine
crawler.on("fetchstart", function(queueItem) {
  console.log("Fetching", queueItem.url);
  var collamine = try_collamine(queueItem.url);
  if (collamine && collamine != 'not found') {
    queueItem.fetched = true;
    console.log(queueItem.status);
    console.log(queueItem.stateData);
  }
});

crawler.on("fetchheaders", function(queueItem, responseObject) {
  console.log("Headers for " + queueItem.url + " are received from the server. ");
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
    path: '/download/html/' + encodeURIComponent(url)
  };

  http.request(COLLAMINE_DOWNLOAD_URL, function(response) {
    var str = '';
    // another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    // the whole response has been received
    response.on('end', function () {
      return str;
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