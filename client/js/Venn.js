var Venn = {};
Venn.drawVenn = function(){
	ctx.beginPath();
	ctx.arc(128,128,64,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(192,128,64,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(160,192,64,0,2*Math.PI);
	ctx.stroke();
};