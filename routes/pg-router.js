var isDev = process.argv[2] === 'dev' ? true : false;
var pg = require('pg');
var CONFIG = require('../configs/serverConfig.json');
console.log('isDev = ', isDev);

var express = require('express');
var router = express.Router();

// =============== handlers for DB changes


router.post('/api/v1/games', function (req, res) {
   var results = [];

    // Grab data from http request
    var game = req.body.game;

    // Get a Postgres client from the connection pool
    pg.connect(CONFIG.connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO games(text, data) values($1, $2)", [game.id, game]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM games ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });


});
module.exports = router;