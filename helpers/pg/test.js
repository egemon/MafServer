var pgApi = require('./myPgApi');

// pgApi.read('games', [209, 999999]).then(function (results) {
// 	console.log('results', results);
// });

pgApi.create('test', [{data: 'illi1'}, {ds: 'illi2'}]).then(function (results) {
	console.log('results', results);
}, function (errs) {
	console.log('errs', errs);
})