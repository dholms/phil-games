var Venn = function(x, y, r, categories){
	this.categories = categories;
	this.currentlySelecting = [];
	this.shaded=[false, false, false, false, false, false, false];
	this.marked=[0, 0, 0, 0, 0, 0, 0];
	this.lastMarkup={
		shaded: [false, false, false, false, false, false, false],
		marked: [0, 0, 0, 0, 0, 0, 0]
	};
	this.params = Venn.params;
	this.params.r = r;
	this.params.c1.x = x+r;
	this.params.c1.y = y+r+20;
	this.params.c2.x = x+2*r;
	this.params.c2.y = y+r+20;
	this.params.c3.x = x+1.5*r;
	this.params.c3.y = y+2*r+20;
	//get markPattern later (on activation) so server has time to load it
	this.markPattern;
	this.isActive = false;
	try{
		canvas.addEventListener('mousedown', this.processClick.bind(this), false)
		canvas.addEventListener('mouseup', this.mouseUp.bind(this), false)
		canvas.addEventListener('mousemove', this.mouseMove.bind(this), false)

		$(canvas).bind('contextmenu', function(e){
	    	return false;
		});
	} catch(err){
		//running out of browser
	}
}

//coordinates for circles and angles of intersection
Venn.params={
	r: 64,
	c1: {
		x: 128,
		y: 128,
		c21: 5*Math.PI/3,
		c22: Math.PI/3,
		c31: 2*Math.PI/3,
		c32: Math.PI/18
	},
	c2: {
		x: 192,
		y: 128,
		c11: 4*Math.PI/3,
		c12: 2*Math.PI/3,
		c31: 17*Math.PI/18,
		c32: Math.PI/3
	},
	c3: {
		x: 160,
		y: 192,
		c11: 19*Math.PI/18,
		c12: 5*Math.PI/3,
		c21: 4*Math.PI/3,
		c22: 35*Math.PI/18
	}
};

//Stores the current markup
Venn.prototype.saveMarkup = function(){
	this.lastMarkup = {
		shaded: [],
		marked: []
	}
	for(var i = 0; i < this.shaded.length; i++){
		this.lastMarkup.shaded.push(this.shaded[i]);
		this.lastMarkup.marked.push(this.marked[i]);
	}
}

//Reverts markup of the venn to the last markup saved
Venn.prototype.revertMarkup = function(){
	this.shaded = [];
	this.marked = [];
	for(var i = 0; i < this.lastMarkup.shaded.length; i++){
		this.shaded.push(this.lastMarkup.shaded[i]);
		this.marked.push(this.lastMarkup.marked[i]);
	}
}

//activates the venn and adds the pattern for use in markup
Venn.prototype.activate = function(){
	this.isActive = true;
	var img = document.getElementById("pattern");
	this.markPattern = ctx.createPattern(img, "repeat");
}

Venn.prototype.deactivate = function(){
	this.isActive = false;
}

Venn.prototype.getShaded = function(){
	return this.shaded;
}

Venn.prototype.getMarked = function(){
	return this.marked;
}

//draw outlines of Venn diagram circles
Venn.prototype.drawVenn = function(){
	this.drawCircle(1);
	this.drawCircle(2);
	this.drawCircle(3);
};

//draw a specific circle
//circle: (string) name of circle to show ie "c1"
//return: nothing
Venn.prototype.drawCircle = function(circle){
	var circleName = "c" + circle;
	var r = this.params.r;
	var circ = this.params[circleName];
	ctx.beginPath();
	ctx.arc(circ.x,circ.y,r,0,2*Math.PI);
	ctx.stroke();
	ctx.stroke();

	ctx.font = "16pt Arial";
	ctx.textAlign = "center";
	var x = circ.x;
	var y = circ.y;
	if(circle == 3){
		y += Venn.params.r + 16;
	} else{
		y -= Venn.params.r + 8;
		if(circle == 1){
			x -= 20;
		} else{
			x += 20;
		}
	}

	ctx.fillText(this.categories[circle-1], x, y)
}

Venn.prototype.processClick = function(e){
	e.preventDefault();
	if(this.isActive){
	    var cell = this.findCell(e);
	    if(e.which === 1 && !e.shiftKey){
	    	this.currentlySelecting = [cell];
	    }
	    if(e.which === 3 || (e.which === 1 && e.shiftKey)){
	    	this.shaded[cell] = !this.shaded[cell];
	    	this.marked[cell] = 0;
	    	this.colorVenn();
	    }
	}
}

//mouseMove is used for selecting more than one area of the venn at a time
//adds anything moused over to the currently selected list
Venn.prototype.mouseMove = function(e){
	e.preventDefault();
	if(this.isActive && e.buttons === 1){
		var cell = this.findCell(e);
		if(!this.isCurrentlySelecting(cell) ){
			this.currentlySelecting.push(cell);
		}
	}
}

//mouseUp is the end of selecting an area
//colors and groups together everything added during mouseMove
Venn.prototype.mouseUp = function(e){
	e.preventDefault();
	if(this.isActive){
		if(this.currentlySelecting.length === 1){
			var cell = this.currentlySelecting[0];
			if(this.marked[cell] !== 0){
				this.marked[cell] = 0;
			} else{
				this.markSelected();
			}
		} else{
			this.markSelected();
		}
		this.currentlySelecting = [];
		this.colorVenn();
	}
}

//changes internal representation when a user finishes clicking and dragging
Venn.prototype.markSelected = function(){
	var max = 0;
	for(var i = 0; i < this.marked.length; i++){
		max = Math.max(max, this.marked[i])
	}
	for(var i = 0; i < this.currentlySelecting.length; i++){
		var index = this.currentlySelecting[i];
		this.marked[index] = max+1;
		this.shaded[index] = false;
	}
}

//checks to see if a cell is currently being selected during a click and drag
Venn.prototype.isCurrentlySelecting = function(cell){
	for(var i = 0; i < this.currentlySelecting.length; i++){
		if(this.currentlySelecting[i] === cell){
			return true;
		}
	}
	return false;
}

//determines whether a value is in the given circle
//x: (int) x coordinate of click, y: (int) y coordinate of click, circ: (string) circle name
//return: (boolean) if the point is in the circle
Venn.prototype.inCircle = function(x, y, circ){
	var circle = this.params[circ];
	var distFromCenter = Math.sqrt(Math.pow(x-circle.x,2) + Math.pow(y-circle.y,2))
	return distFromCenter < this.params.r;
}

//finds the cell that the user clicked in
//x: (int) x coordinate of click, y: (int) y coordinate of click
//return: (int from -1-6) the number of the cell that the user clicked (-1 corresponds to no cell)
Venn.prototype.findCell = function(e){
	var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;
    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

	var x = e.pageX-totalOffsetX;
    var y = e.pageY-totalOffsetY;

	var c1 = this.inCircle(x, y, "c1");
	var c2 = this.inCircle(x, y, "c2");
	var c3 = this.inCircle(x, y, "c3");
	if(!c1 && !c2 && !c3){return -1;}
	if(c1 && !c2 && !c3){return 0;}
	if(!c1 && c2 && !c3){return 1;}
	if(!c1 && !c2 && c3){return 2;}
	if(c1 && c2 && !c3){return 3;}
	if(c1 && !c2 && c3){return 4;}
	if(!c1 && c2 && c3){return 5;}
	if(c1 && c2 && c3){return 6;}
}

//fill in the given cell
//cell: (integer from 0-6) cell to be colored, color: (string) hex value of color for fill
//return: nothing
Venn.prototype.fill = function(cell, color, pattern){
	if(pattern){
		ctx.fillStyle = this.markPattern;
	} else{
		ctx.fillStyle=color;
	}
	ctx.beginPath();
	ctx.strokeStyle=color;
	this.trace(cell);
	ctx.fill();
	ctx.stroke();
}

//Uses the arc function to stroke an arc
//circ: (string) of circle name, start/end: (string) points of intersection, cc: (boolean) counterclockwise
//return: nothing
Venn.prototype.drawArc = function(circ, start, end, cc){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	this.arc(circ, start, end, cc);
	ctx.stroke();
	ctx.stroke();
}

//completely colors Venn
//shades, marks, clears, and draws outline based on current markup
Venn.prototype.colorVenn = function(){
	for(var i = 0; i < this.shaded.length; i++){
		if(this.shaded[i]){
			this.fill(i, "#F44336");
		} else if(this.marked[i]){
			this.fill(i, "white", true);
		} else{
			this.fill(i, "white");
		}
	}
	if(!this.sameMark(0,3)){
		this.drawArc("c2", "c31", "c11", false);
	}
	if(!this.sameMark(0,4)){
		this.drawArc("c3", "c11", "c21", false);
	}
	if(!this.sameMark(1,3)){
		this.drawArc("c1", "c21", "c32", false);
	}
	if(!this.sameMark(1,5)){
		this.drawArc("c3", "c12", "c22", false);
	}
	if(!this.sameMark(2,4)){
		this.drawArc("c1", "c22", "c31", false);
	}
	if(!this.sameMark(2,5)){
		this.drawArc("c2", "c32", "c12", false);
	}
	if(!this.sameMark(3,6)){
		this.drawArc("c3", "c21", "c12", false);
	}
	if(!this.sameMark(4,6)){
		this.drawArc("c2", "c12", "c31", false);
	}
	if(!this.sameMark(5,6)){
		this.drawArc("c1", "c32", "c22", false);
	}


	this.drawBorder();
}

//checks if two sections are in the same selection
Venn.prototype.sameMark = function(i, j){
	if(this.marked[i] === 0 || this.marked[j] ===0){
		return false;
	}
	return (this.marked[i] === this.marked[j]);
}

//draws the entire borders for the venn in black
Venn.prototype.drawBorder = function(){
	ctx.beginPath();
	ctx.strokeStyle="#000000";
	this.arc("c1", "c31", "c21", false);
	this.arc("c2", "c11", "c32", false);
	this.arc("c3", "c22", "c11", false);
	ctx.stroke();
	ctx.stroke();
}


//ctx traces path around the given cell
//cell: (integer from 0-6) cell to be traced around
//return: nothing
Venn.prototype.trace = function(cell){
	ctx.beginPath();
	switch(cell){
		case 0:
			this.arc("c1","c31","c21",false);
			this.arc("c2","c11","c31",true);
			this.arc("c3","c21","c11",true);
			break;
		case 1:
			this.arc("c2","c11","c32",false);
			this.arc("c3","c22","c12",true);
			this.arc("c1","c32","c21",true);
			break;
		case 2:
			this.arc("c1","c31","c22",true);
			this.arc("c2","c12","c32",true);
			this.arc("c3","c22","c11",false);
			break;
		case 3:
			this.arc("c2","c31","c11",false);
			this.arc("c1","c21","c32",false);
			this.arc("c3","c12","c21",true);
			break;
		case 4:
			this.arc("c3","c11","c21",false);
			this.arc("c2","c31","c12",true);
			this.arc("c1","c22","c31",false);
			break;
		case 5:
			this.arc("c1","c22","c32",true);
			this.arc("c3","c12","c22",false);
			this.arc("c2","c32","c12",false);
			break;
		case 6:
			this.arc("c3","c21","c12",false);
			this.arc("c1","c32","c22",false);
			this.arc("c2","c12","c31",false);
			break;
	}
}

//traces arc
//circ: (string) of circle name, start/end: (string) points of intersection, cc: (boolean) counterclockwise
//return: nothing
Venn.prototype.arc = function(circ, start, end, cc){
	var circle = this.params[circ];
	ctx.arc(circle.x, circle.y, this.params.r, circle[start], circle[end], cc);
}
