
require('dotenv').config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var axios = require('axios');
var yelp = require('yelp-fusion');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

// arguments to be passed in
var app = process.argv[2];
var args = process.argv.slice(3);
var isSearchEmpty;

function omdb(args) {
    if (isSearchEmpty === false) {
        console.log('OMDB ARGHS IS EMPTY - SETTING TO DEFAULT');
        args = 'Mr. Nobody';
    }
    console.log(`SEARCHING FOR: ${args}`);
    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = `http://www.omdbapi.com/?t=${args}&y=&plot=short&apikey=${keys.OMDB_KEY}`;

    // axios get, then, catch
    axios.get(queryUrl)
        .then(function (response) {
            // console.log(response.data);
            // * Title of the movie.
            console.log(`Title: ${response.data.Title}`);
            // * Year the movie came out.
            console.log(`Year: ${response.data.Year}`);

            //   * IMDB Rating of the movie.
            console.log(`IMDB Rating: ${response.data.imdbRating}`);

            //   * Rotten Tomatoes Rating of the movie.
            console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);

            //   * Country where the movie was produced.
            console.log(`Country: ${response.data.Country}`);

            //   * Language of the movie.
            console.log(`Language: ${response.data.Language}`);

            //   * Plot of the movie.
            console.log(`Plot: ${response.data.Plot}`);

            //   * Actors in the movie.
            console.log(`Actors: ${response.data.Actors}`);
            console.log('\n');

        }).catch(function (error) {
            console.log(error);
        });
};

function runSpotify(args) {
    if (isSearchEmpty === false) {
        console.log('Looking up "I want it that way"');
        args = ['i', 'want', 'it', 'that', 'way'];
    }
    spotify.search(
        {
            type: 'track',
            query: args,
            limit: 1
        },
        function (err, data) {
            if (err) {
                console.log('Try: [node] [liri] [spotify] [song name]');
                return;
            }
            var songs = data.tracks.items;
            // console.log(data);

            // Artist name
            console.log(`Artist's name: ${JSON.stringify(songs[0].artists[0].name, null, 2)}`);
            // The song's name name
            console.log(`Song's name: ${JSON.stringify(songs[0].name, null, 2)}`);

            // A preview link of the song from Spotify - preview_url
            console.log(`Preview url: ${JSON.stringify(songs[0].preview_url, null, 2)}`);

            // The album that the song is from - album.name
            console.log(`Album: ${JSON.stringify(songs[0].album.name, null, 2)}`);
            console.log('\n');
        }
    )
};

function runYelp(args) {
    var searchRequest = {
        term: process.argv[3],
        location: process.argv[4]
    };

    var apiKey = keys.YELP_KEY;

    var client = yelp.client(apiKey);

    client.search(searchRequest)
        .then(response => {
            var firstResult = response.jsonBody.businesses[0];
            // var prettyJson = JSON.stringify(firstResult, null, 4);
            // console.log(prettyJson);
            console.log(`Name: ${firstResult.name}`);
            console.log(`Is it closed?: ${firstResult.is_closed}`);
            console.log(`Rating: ${firstResult.rating}`);
            console.log(`Price: ${firstResult.price}`);
            console.log(`Location: ${firstResult.location.address1}`);
            console.log(`${firstResult.location.city}`);
            console.log(`${firstResult.location.zip_code}`);
            console.log(`${firstResult.location.state}`);
            console.log('\n');

        }).catch(err => {
            // console.log(err);
            console.log('Try: [node] [liri] [yelp] [name] [city]');
        });
};

function doWhatItSays() {
    fs.readFile('./random.txt', 'utf8', function (err, data) {
        if (err) return console.log(err);

        var dataSplit = data.split(',');
        runApplication(dataSplit[0], dataSplit[1]);
    });
};

function isArgsEmpty(args) {
    if (args.length === 0) {
        isSearchEmpty = false;
    } else {
        isSearchEmpty = true;
    }
}

function runApplication(app, args) {
    if (app === undefined) {
        console.log('TRY: [node] [liri] [movie-this/spotify-this-song/yelp] [search]')
    } else if (app === 'movie-this') {
        omdb(args);
    } else if (app === 'spotify-this-song') {
        runSpotify(args);
    } else if (app === 'yelp') {
        runYelp(args);
    } else if (app === 'do-what-it-says') {
        doWhatItSays();
    }
}

isArgsEmpty(args);
runApplication(app, args);



