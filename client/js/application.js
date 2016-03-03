var canvas;
var ctx;

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	var statements = {
		categories: ["cows", "mammals", "nice"],
		statementList: ["some 2 are 3 or 1", "no 1 are 3"]
	}
	var problem = new Problem(statements);

});

