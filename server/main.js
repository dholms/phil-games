var http = require('http');
var mongojs = require('mongojs');
var uri = 'mongodb://admin:admin@ds055495.mongolab.com:55495/phil-games';
var collections = ['demo'];
var db = mongojs(uri, collections);