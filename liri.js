
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var yelp = require('yelp-fusion');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
// console.log(keys.spotify)

// argument
var app = process.argv[2];
var args = process.argv.slice(3);
console.log(app, args);

// [node] [liri] [api] [search]
if (app == 'movie') {
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = 'http://www.omdbapi.com/?t=' + args + '&y=&plot=short&apikey=' + keys.OMDB_KEY;

    // axios get, then, catch
    axios.get(queryUrl)
        .then(function (response) {
            console.log(response.data);
            console.log(`Year: ${response.data.Year}`);

        }).catch(function (error) {
            console.log(error);
        });
    console.log(keys.OMDB_KEY);
} else if (app == 'spotify') {
    spotify.search(
        {
            type: 'track',
            query: args
        },
        function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            var songs = data.tracks.items;
            console.log(songs);
        }
    )
} else if (app == 'yelp') {
    var searchRequest = {
        term: process.argv[3],
        location: process.argv[4]
    };

    var apiKey = keys.YELP_KEY;

    var client = yelp.client(apiKey);

    client.search(searchRequest)
        .then(response => {
            var firstResult = response.jsonBody.businesses[0];
            var prettyJson = JSON.stringify(firstResult, null, 4);
            console.log(prettyJson);
        }).catch(err => {
            console.log(err);
        });
} else if (app == 'do-what-it-says') {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) return console.log(err);

        var dataSplit = data.split(',');
        var dataNew = dataSplit.map(function (el) {
            return el.trim();
        });

        dataNew.forEach(function (item, index, arr) {
            console.log(item);
        });

    });
};

//FS READ WRITE

// takes in name of file to write to
// fs.writeFile('litfam.txt', 'fam its lit, star war, star trek', function (err) {
//     if (err) return console.log(err);
//     console.log('file write success');
// });

// 

