var http = require('http');
//mongo
var mongojs = require('mongojs');
var uri = 'mongodb://admin:admin@ds055495.mongolab.com:55495/phil-games';
var collections = ['categories'];

var db = mongojs(uri, collections);
console.log("Connected to DB");
//express
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('Hello World');
});

app.listen(3000);

/*db.categories.find({singular: "cow"}, function(err, categories) {
	if (err || !categories) {
		console.log("Not found");
	} else {
		categories.forEach(function(a) {
			console.log(a);
		});
	}
});*/

var num1 = Math.floor(Math.random() * (5 - 1) + 1);
var num2 = Math.floor(Math.random() * (5 - 1) + 1);
var num3 = Math.floor(Math.random() * (5 - 1) + 1);
while (num1 == num2 || num1 == num3 || num2 == num3) {
	num1 = Math.floor(Math.random() * (5 - 1) + 1);
	num2 = Math.floor(Math.random() * (5 - 1) + 1);
	num3 = Math.floor(Math.random() * (5 - 1) + 1);
}

console.log("num1 = "+num1);
console.log("num2 = "+num2);
console.log("num3 = "+num3);

/*db.categories.find(function(err, categories) {
	categories.forEach(function(a) {
		console.log(a);
	});
});*/

db.categories.find({index: num1}, function(err, categories) {
	if (err || !categories) {
		console.log("Not found");
	} else {
		categories.forEach(function(a) {
			console.log(a);
		});
	}
});
db.categories.find({index: num2}, function(err, categories) {
	if (err || !categories) {
		console.log("Not found");
	} else {
		categories.forEach(function(a) {
			console.log(a);
		});
	}
});
db.categories.find({index: num3}, function(err, categories) {
	if (err || !categories) {
		console.log("Not found");
	} else {
		categories.forEach(function(a) {
			console.log(a);
		});
	}
});