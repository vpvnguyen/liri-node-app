
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var yelp = require('yelp-fusion');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
// console.log(keys.spotify)

// arguments to be passed in
var app = process.argv[2];
var args = process.argv.slice(3);

function userInput(app, args) {
    console.log(`USER INPUT: ${app} | ${args}`)
    // check if user input 
    if (app === '') {
        console.log('there are arguments')
    } else {
        console.log('no arguments')
    }
}
userInput(app, args);
// [node] [liri] [api] [search]
if (app == 'movie') {
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = `http://www.omdbapi.com/?t=${args}&y=&plot=short&apikey=${keys.OMDB_KEY}`;

    // axios get, then, catch
    axios.get(queryUrl)
        .then(function (response) {
            console.log(response.data);
            console.log(`Year: ${response.data.Year}`);

        }).catch(function (error) {
            console.log(error);
        });
} else if (app == 'spotify') {
    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    if (!args) {
        console.log(args)
        args = 'the sign';

    }
    spotify.search(
        {
            type: 'track',
            query: args,
            limit: 1
        },
        function (err, data) {
            if (err) {
                // console.log(err);
                return;
            }
            var songs = data.tracks.items;
            // console.log(data);
            // spotify
            // Artist name
            console.log(`Artist's name: ${JSON.stringify(songs[0].artists[0].name, null, 2)}`)
            // The song's name name
            console.log(`Song's name: ${JSON.stringify(songs[0].name, null, 2)}`)

            // A preview link of the song from Spotify - preview_url
            console.log(`Preview url: ${JSON.stringify(songs[0].preview_url, null, 2)}`)

            // The album that the song is from - album.name
            console.log(`Album: ${JSON.stringify(songs[0].album.name, null, 2)}`)

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
    //FS READ from random.txt

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


// takes in name of file to write to
// fs.writeFile('litfam.txt', 'fam its lit, star war, star trek', function (err) {
//     if (err) return console.log(err);
//     console.log('file write success');
// });




// * Title of the movie.
// * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Rotten Tomatoes Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.
//   if the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'


