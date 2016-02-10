var canvas;
var ctx;

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	canvas.addEventListener('click', function(e){
		Venn.processClick(e);
	}, false)
	Venn.drawVenn();
});

