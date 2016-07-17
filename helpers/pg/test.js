var pgApi = require('./myPgApi');

pgApi.update('gametest', [
    {nick: 'data', date: '2016-01-01'},
    {nick: 'data', date: '2016-01-01'},
    {nick: 'data', date: '2016-01-01'},
    {nick: 'datadatadatadatadata', date: '2016-01-01'},
    ], [1,2,300,4]).then(function (results) {
	console.log('results', results);
});

// pgApi.create('test', [{data: 'illi1'}, {f: 'illi2'}, {data: 'illi3'}]).then(function (results) {
// 	console.log('results', results);
// }, function (errs) {
// 	console.log('errs', errs);
// });