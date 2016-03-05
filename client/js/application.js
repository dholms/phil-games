var canvas;
var ctx;

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	
	var statements = {
		categories: ["cows", "mammals", "nice"],
		statementList: ["no 1 are 2", "no 1 are 3"]
	}

	var problem = new Problem(statements);

	//attach listeners to buttons
	$('#catCheckButton').click(problem.checkCategories);
	$('#vennCheckButton').click(problem.checkVenn);

});

