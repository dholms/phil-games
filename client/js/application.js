var canvas;
var ctx;

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	
	var statements = {
		categories: ["cows", "mammals", "nice"],
		statementList: ["no 1 are 2", "no 2 are 3"],
		conclusion: "no 3 are not 1 and 2"
	}

	var problem = new Problem(statements);

});

