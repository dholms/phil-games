var canvas;
var ctx;
var dbUrl = "http://philgames-neta.apps.unc.edu/problem/";

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
// <<<<<<< HEAD
// =======
	
// 	var statements = {
// 		categories: ["cows", "mammals", "nice"],
// 		statementList: ["no 1 are 2", "no 2 are 3"],
// 		conclusion: "no 3 are not 1 and 2"
// 	}
// >>>>>>> 3320dbbba091ca03463314f6e3087063f76084dc

	var user = new User("admin", "password");
	user.getProblem();
	
	// var statements = {
	// 	categories: ["cows", "mammals", "nice"],
	// 	statementList: ["no 1 are 2", "no 2 are 3"],
	// 	conclusion: "Some 3 are 1"
	// }

	// var problem = new Problem(statements);
});

