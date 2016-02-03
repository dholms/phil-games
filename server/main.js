var http = require('http');
//mongo
var mongojs = require('mongojs');
var uri = 'mongodb://admin:admin@ds055495.mongolab.com:55495/phil-games';
var collections = ['demo'];
var db = mongojs(uri, collections);
//express
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('Hello World');
});

app.listen(3000);