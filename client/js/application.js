var canvas;
var ctx;

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	var venn = new Venn(5,5,80);
	
	var statement1 = new Statement("All cows are mammals");
	var statement2 = new Statement("All mammals are nice");

	$('.check').click(function(e){
		statement1.incrCategory();
		statement2.incrCategory();
	})
});

