
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

// OMDB
function runOMDB(args) {
    if (isSearchEmpty === false) {
        // if no arguments, set default
        args = 'Mr. Nobody';
    }

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = `http://www.omdbapi.com/?t=${args}&y=&plot=short&apikey=${keys.OMDB_KEY}`;

    // axios get, then, catch
    axios.get(queryUrl)
        .then(function (response) {

            // log movie information
            console.log(`Title: ${response.data.Title}`);
            console.log(`Year: ${response.data.Year}`);
            console.log(`IMDB Rating: ${response.data.imdbRating}`);
            console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
            console.log(`Country: ${response.data.Country}`);
            console.log(`Language: ${response.data.Language}`);
            console.log(`Plot: ${response.data.Plot}`);
            console.log(`Actors: ${response.data.Actors}`);
            console.log('\n');

            fs.appendFileSync('log.txt', `\n`);
            fs.appendFileSync('log.txt', '-----OMDB-----\n');
            fs.appendFileSync('log.txt', `Title: ${response.data.Title}\n`);
            fs.appendFileSync('log.txt', `Year: ${response.data.Year}\n`);
            fs.appendFileSync('log.txt', `IMDB Rating: ${response.data.imdbRating}\n`);
            fs.appendFileSync('log.txt', `Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}\n`);
            fs.appendFileSync('log.txt', `Country: ${response.data.Country}\n`);
            fs.appendFileSync('log.txt', `Language: ${response.data.Language}\n`);
            fs.appendFileSync('log.txt', `Plot: ${response.data.Plot}\n`);
            fs.appendFileSync('log.txt', `Actors: ${response.data.Actors}\n`);
            fs.appendFileSync('log.txt', `\n`);


        }).catch(function (error) {
            console.log(error);
            console.log('Try: [node] [liri] [spotify] [song name]');
        });
};

// spotify
function runSpotify(args) {
    if (isSearchEmpty === false) {
        // if search is empty, set default
        args = 'the sign';
    }
    spotify.search(
        {
            type: 'track',
            query: args,
            limit: 5
        },
        function (err, data) {
            if (err) {
                console.log(err)
                console.log('Try: [node] [liri] [spotify] [song name]');
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                // log artist, song, preview link, album
                console.log(`Artist's name: ${JSON.stringify(songs[i].artists[0].name, null, 2)}`);
                console.log(`Song's name: ${JSON.stringify(songs[i].name, null, 2)}`);
                console.log(`Preview url: ${JSON.stringify(songs[i].preview_url, null, 2)}`);
                console.log(`Album: ${JSON.stringify(songs[i].album.name, null, 2)}`);
                console.log('\n');

                fs.appendFileSync('log.txt', '\n');
                fs.appendFileSync('log.txt', '-----SPOTIFY-----\n');
                fs.appendFileSync('log.txt', `Artist's name: ${songs[i].artists[0].name}\n`);
                fs.appendFileSync('log.txt', `Song name: ${songs[i].name}\n`);
                fs.appendFileSync('log.txt', `Preview url: ${songs[i].preview_url}\n`);
                fs.appendFileSync('log.txt', `Album: ${songs[i].album.name}\n`);
                fs.appendFileSync('log.txt', '\n');
            }

        }
    )
};

// yelp-fusion
function runYelp(args) {

    // create header to search for business name and location
    var searchRequest = {
        term: process.argv[3],
        location: process.argv[4]
    };

    var client = yelp.client(keys.YELP_KEY);

    // search for business information
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

            fs.appendFileSync('log.txt', '\n');
            fs.appendFileSync('log.txt', '-----YELP-----\n');
            fs.appendFileSync('log.txt', `Name: ${firstResult.name}\n`);
            fs.appendFileSync('log.txt', `Is it closed?: ${firstResult.is_closed}\n`);
            fs.appendFileSync('log.txt', `Rating: ${firstResult.rating}\n`);
            fs.appendFileSync('log.txt', `Price: ${firstResult.price}\n`);
            fs.appendFileSync('log.txt', `Location: ${firstResult.location.address1}\n`);
            fs.appendFileSync('log.txt', `${firstResult.location.city}\n`);
            fs.appendFileSync('log.txt', `${firstResult.location.zip_code}\n`);
            fs.appendFileSync('log.txt', `${firstResult.location.state}\n`);
            fs.appendFileSync('log.txt', '\n');
        }).catch(err => {
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

// check if arguments are empty
function isArgsEmpty(args) {
    if (args.length === 0) {
        isSearchEmpty = false;
    } else {
        isSearchEmpty = true;
    }
};

// check user input and runs appropriate app
function runApplication(app, args) {
    if (app === undefined) {
        console.log('TRY: [node] [liri] [movie-this/spotify-this-song/yelp] [search]');
    } else if (app === 'movie-this') {
        runOMDB(args);
    } else if (app === 'spotify-this-song') {
        runSpotify(args);
    } else if (app === 'yelp') {
        runYelp(args);
    } else if (app === 'do-what-it-says') {
        doWhatItSays();
    } else {
        console.log('TRY: [node] [liri] [movie-this/spotify-this-song/yelp] [search]');
    }
};

// run liri
isArgsEmpty(args);
runApplication(app, args);



