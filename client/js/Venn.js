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

Venn.fill = function(cell){
	ctx.fillStyle="#FF0000";
	ctx.beginPath();
	
	switch(cell){
		case 1:
			ctx.arc(128,128,64,2*Math.PI/3,5*Math.PI/3,false);
			ctx.arc(192,128,64,4*Math.PI/3,23*Math.PI/24,true);
			ctx.arc(160,192,64,4*Math.PI/3,25*Math.PI/24,true);
			break;
		case 2:
			ctx.arc(192,128,64,4*Math.PI/3,23*Math.PI/24,true);
			ctx.arc(160,192,64,4*Math.PI/3,5*Math.PI/3,false);
			ctx.arc(128,128,64,0,5*Math.PI/3,true);
			break;
		case 3:
			ctx.arc(128,128,64,0,5*Math.PI/3,true)
			ctx.arc(192,128,64,4*Math.PI/3,Math.PI/3,false)
			ctx.arc(160,192,64,23*Math.PI/24,5*Math.PI/3,true)
			break;
		case 4:
			ctx.arc(128,128,64,2*Math.PI/3,5*Math.PI/3)
			ctx.arc(192,128,64,4*Math.PI/3,23*Math.PI/24,true)
			ctx.arc(160,192,64,4*Math.PI/3,25*Math.PI/24,true)
			break;
		case 5:
			ctx.arc(128,128,64,2*Math.PI/3,5*Math.PI/3)
			ctx.arc(192,128,64,4*Math.PI/3,23*Math.PI/24,true)
			ctx.arc(160,192,64,4*Math.PI/3,25*Math.PI/24,true)
			break;
		case 6:
			ctx.arc(128,128,64,2*Math.PI/3,5*Math.PI/3)
			ctx.arc(192,128,64,4*Math.PI/3,23*Math.PI/24,true)
			ctx.arc(160,192,64,4*Math.PI/3,25*Math.PI/24,true)
			break;
		case 7:
			ctx.arc(128,128,64,2*Math.PI/3,5*Math.PI/3)
			ctx.arc(192,128,64,4*Math.PI/3,23*Math.PI/24,true)
			ctx.arc(160,192,64,4*Math.PI/3,25*Math.PI/24,true)
			break;
	}
	ctx.fill();
	ctx.stroke();
}