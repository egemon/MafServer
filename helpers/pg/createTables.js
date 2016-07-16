var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://zgnzyaffdzjhcy:zdxG_Iyl3lm4Ardyhsi4YZDNo3@ec2-54-221-244-190.compute-1.amazonaws.com:5432/dcm7vrqpua1afn';
pg.defaults.ssl = true;

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE games(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, data JSON)');
query.on('end', function() { client.end(); });