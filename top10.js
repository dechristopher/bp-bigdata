// bp-bigdata/top10.js - Created February 28th, 2018

// NPM Modules
const fs = require('fs');
const csv = require('csvtojson');
const events = require('events');

// Create an eventEmitter object
const emitter = new events.EventEmitter();

// JSON to CSV options
const json2csv = require('json2csv').parse;
const fields = ['name', 'points', 'assists', 'turnovers', 'rebounds', 'games'];
const opts = { fields };

let totFiles = 0;

fs.readdir('./players', { encoding: 'utf-8' }, function(err, files) {
	const allPlayerStats = [];
	let count = 0;
	totFiles = files.length;
	files.forEach(file => {
		console.log(`Processing ${file}`);
		compress(file).then(playerJSON => {
			console.log(playerJSON);
			allPlayerStats.push(playerJSON);
			// emit count
			emitter.emit('processed', count, allPlayerStats);
			count++;
		});
	});
	console.log(allPlayerStats);
});


emitter.on('processed', function(count, allPlayerStats) {
	if(count === totFiles - 1) {
		// build CSV
		const genCSV = json2csv(allPlayerStats, opts);
		// console.log(genCSV);
		fs.writeFile('./data/top10.csv', genCSV, function() {
			console.log('\nWrote stats to /data/top10.csv');
		});
	}
});


function compress(file) {
	return new Promise(function(resolve) {
		const player = {
			name: '',
			points: 0,
			assists: 0,
			rebounds: 0,
			turnovers: 0,
			games: 0,
		};
		getJSON(file).then(entries => {
			player.name = entries[0].playDispNm;
			player.games = entries.length;
			entries.forEach(function(value, index) {
				// console.log(value);
				player.points += parseInt(value.playPTS);
				player.assists += parseInt(value.playAST);
				player.turnovers += parseInt(value.playTO);
				player.rebounds += parseInt(value.playTRB);
				if(index === entries.length - 1) {
					resolve(player);
				}
			});
		}).then(() => {
			// console.log(player);
			resolve(player);
		});
	});
}

function getJSON(file) {
	return new Promise(function(resolve) {
		const entries = [];
		csv().fromFile(`./players/${file}`).on('json', (jsonObj) => {
			entries.push(jsonObj);
		}).on('done', function() {
			resolve(entries);
		});
	});
}