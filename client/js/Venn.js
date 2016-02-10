var Venn = {};
//coordinates for circles and angles of intersection
Venn.intersect={
	r: 64,
	c1: {
		x: 128,
		y: 128,
		c21: 5*Math.PI/3,
		c22: Math.PI/3,
		c31: 2*Math.PI/3,
		c32: Math.PI/24
	},
	c2: {
		x: 192,
		y: 128,
		c11: 4*Math.PI/3,
		c12: 2*Math.PI/3,
		c31: 23*Math.PI/24,
		c32: Math.PI/3
	},
	c3: {
		x: 160,
		y: 192,
		c11: 25*Math.PI/24,
		c12: 5*Math.PI/3,
		c21: 4*Math.PI/3,
		c22: 47*Math.PI/24
	}
};

//draw outlines of Venn diagram circles
Venn.drawVenn = function(){
	var c1 = Venn.intersect.c1;
	var c2 = Venn.intersect.c2;
	var c3 = Venn.intersect.c3;
	var r = Venn.intersect.r;
	ctx.beginPath();
	ctx.arc(c1.x,c1.y,r,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(c2.x,c2.y,r,0,2*Math.PI);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(c3.x,c3.y,r,0,2*Math.PI);
	ctx.stroke();
};

//fill in the given cell
//cell: (integer from 1-7) cell to be colored
Venn.fill = function(cell){
	ctx.fillStyle="#FF0000";
	ctx.beginPath();
	
	switch(cell){
		case 1:
			Venn.arc("c1","c31","c21",false);
			Venn.arc("c2","c11","c31",true);
			Venn.arc("c3","c21","c11",true);
			break;
		case 2:
			Venn.arc("c2","c31","c11",false);
			Venn.arc("c1","c21","c32",false);
			Venn.arc("c3","c12","c21",true);
			break;
		case 3:
			Venn.arc("c2","c11","c32",false);
			Venn.arc("c3","c22","c12",true);
			Venn.arc("c1","c32","c21",true);
			break;
		case 4:
			Venn.arc("c3","c11","c21",false);
			Venn.arc("c2","c31","c12",true);
			Venn.arc("c1","c22","c31",false);
			break;
		case 5:
			Venn.arc("c3","c21","c12",false);
			Venn.arc("c1","c32","c22",false);
			Venn.arc("c2","c12","c31",false);
			break;
		case 6:
			Venn.arc("c1","c22","c32",true);
			Venn.arc("c3","c12","c22",false);
			Venn.arc("c2","c32","c12",false);
			break;
		case 7:
			Venn.arc("c1","c31","c22",true);
			Venn.arc("c2","c12","c32",true);
			Venn.arc("c3","c22","c11",false);
			break;
	}
	ctx.fill();
	ctx.stroke();
}

//draw arc
//circ: (string) of circle name, start/end: (string) points of intersection, cc: (boolean) counterclockwise
Venn.arc = function(circ, start, end, cc){
	var circle = Venn.intersect[circ];
	ctx.arc(circle.x, circle.y, Venn.intersect.r, circle[start], circle[end], cc);
}