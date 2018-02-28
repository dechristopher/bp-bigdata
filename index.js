// bp-bigdata/index.js - Created February 27th, 2018

// NPM Modules
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const csv = require('csvtojson');
// const unzip = require('unzip');
const events = require('events');

// Create an eventEmitter object
const emitter = new events.EventEmitter();

// JSON to CSV options
const json2csv = require('json2csv').parse;
const fields = ['name', 'points', 'assists', 'turnovers', 'rebounds'];
const opts = { fields };

// Custom Variables
const { name, version } = require('./package.json');

// Player Name, Points, Assists, Turnovers, Rebounds
// playDispNm, playPTS, playAST, playTO ,playTRB

// Grab ZIP from CDN
function downloadStats(url) {
	return new Promise(function(resolve) {
		const { stdout } = exec(`wget -x --load-cookies cookies.txt -P data -nH --cut-dirs=4 ${url} -O playerData.zip`);
		resolve(stdout);
	});
}

downloadStats('https://www.kaggle.com/pablote/nba-enhanced-stats/downloads/2017-18_playerBoxScore.csv').then(() => {
	// Unzip playerData.zip
	// fs.createReadStream('./playerData.zip').pipe(unzip.Extract({ path: './data' }));
}).then(() => {
	// Extract full data for first 20 players
	let counter = 0;
	const first20 = [];
	// Convert CSV to JSON
	csv().fromFile('./data/2017-18_playerBoxScore.csv').on('json', (jsonObj) => {
		// Extract data to new JSON object
		if(counter < 20) {
			// console.log('Got ' + jsonObj.playDispNm);
			first20.push(jsonObj);
			counter++;
		}
		else if (counter == 20) {
			counter++;
			fs.appendFile('./data/playerData20.json', JSON.stringify(first20), function() {
				console.log('written to file');
				emitter.emit('extracted', first20);
			});
		}
	});
});

// Extract data from first20 file and then toss it all back in a CSV
emitter.on('extracted', function(data) {
	extractData(data).then(strippedData => {
		// console.dir(strippedData);
		console.log('stripping finished');
		try {
			const genCSV = json2csv(strippedData, opts);
			// console.log(genCSV);
			fs.writeFile('./data/data.csv', genCSV, function() {
				console.log('wrote CSV');
			});
		}
		catch (err) {
			console.error(err);
		}
	});
});

// on done event
function extractData(data) {
	// Rewrite new CSV to file
	return new Promise(function(resolve) {
		const strippedData = [];
		data.forEach(function(playerData) {
			strippedData.push({
				name: playerData.playDispNm,
				points: playerData.playPTS,
				assists: playerData.playAST,
				turnovers: playerData.playTO,
				rebounds: playerData.playTRB,
			});
		});
		resolve(strippedData);
	});
}

console.log(`${name} v${version} started`);