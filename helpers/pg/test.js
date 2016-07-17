var pgApi = require('./myPgApi');

pgApi.delete('gametest', [4,5,6,7,8,14,9,10]).then(function (results) {
	console.log('results', results);
});

// pgApi.create('test', [{data: 'illi1'}, {f: 'illi2'}, {data: 'illi3'}]).then(function (results) {
// 	console.log('results', results);
// }, function (errs) {
// 	console.log('errs', errs);
// });