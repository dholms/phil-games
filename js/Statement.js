var Statement = function(text) {
	this.text = text;
	this.color = "blue";
	this.category = 1;
	this.currentWords = [];
	this.currentlyHighlighting = false;
	this.isActive = true;
	this.element = this.createElement(text);
	$('.statements').append(this.element);
};

Statement.prototype.deactivate = function(){
	this.isActive = false;
}

//adds arrow to statement to tell which statement currently has the focus
Statement.prototype.addArrow = function(){
	this.element.addClass('highlighted');
	var arrow = $('<div class="arrow-right"></div>')
	this.element.append(arrow);
}

//removes that arrow
Statement.prototype.removeArrow = function(){
	this.element.removeClass('highlighted');
	this.element.find(".arrow-right").remove();
}

//Creates the statements element with children elements of type span.word for each word in the statement
//text: (string) the text of the statement
//return: (div.statements) the "statements" element
Statement.prototype.createElement = function(text){
	var element = $('<div class="statement"></div>')
	var words = text.split(/ |-/);
	for(var i=0; i < words.length; i++){
		var word = $('<span class="word">'+words[i]+'</span>')
		this.addWordListeners(word);
		element.append(word);

		var delimeter = "";
		if (words[i] == "non"){
			delimeter = $('<span class="space">-</span>');
			this.addWordListeners(delimeter);
		}
		else if(i < words.length-1){
			delimeter = $('<span class="space">&nbsp;</span>');
			this.addWordListeners(delimeter);
		}
		element.append(delimeter);
	}

	return element;
}

//Adds listeners for mousedown and mouseover for each word element
//word: (span.word) word element for listeners to be added to
//return: nothing
Statement.prototype.addWordListeners = function(word){
	var self = this;
	word.mousedown(function(e){
		self.currentlyHighlighting = !self.isHighlighted(e.currentTarget);
		self.toggleWord(e);
	});
	word.mouseover(function(e){
		if(e.buttons === 1){
			self.toggleWord(e);
		}
	});
}

//Toggles the color of the word and adds/removes it to the currently highlighted words
//e: (event) event associated with click/mouseover
//return: nothing
Statement.prototype.toggleWord = function(e){
	if(this.isActive){
		if(this.currentlyHighlighting){
			this.addWord(e.currentTarget);
		} else{
			this.removeWord(e.currentTarget);
		}
	}
}

//Highlights the word and adds it to the list of currently highlighted words.
//word: (span.word) element of the word to be added
//return: nothing
Statement.prototype.addWord = function(word){
	if(!this.isHighlighted(word)){
		$(word).addClass(this.color);
		var text = word.innerHTML;
		if(text != " " && text != "&nbsp;"){
			this.currentWords.push(text);
		}
	}
}

//Unhighlights the word and removes it from the list of currently highlighted words.
//word: (span.word) element of the word to be removed
//return: nothing
Statement.prototype.removeWord = function(word){
	if(this.isHighlighted(word)){
		$(word).removeClass(this.color);
		var text = word.innerHTML;
		this.currentWords.splice(this.currentWords.indexOf(text), 1);
	}
}

//word (span.word) element of the word to check if it is highlighted
//return: (boolean) whether the element is currently highlighted
Statement.prototype.isHighlighted = function(word){
	return $(word).hasClass(this.color);
}

//Increments the category and changes the color associated with the currently highlighted words
Statement.prototype.incrCategory = function(){
	this.currentWords = [];
	this.category++;
	if(this.category === 2){
		this.color = "red";
	}
	if(this.category === 3){
		this.color = "green";
	}
}

//category: (string) category to check if it is highlighted
//return: (int) 0: missed highlight, 1: highlighted (if present), 2: not present
Statement.prototype.isHighlightedCorrectly = function(category){
	if(this.text.indexOf(category) > -1){
		if(this.currentWords.indexOf(category) > -1){
			return 1;
		} else{
			return 0;
		}
	}
	return 2;
}

//returns true if a word is highlighted in the statement that isn't a category
Statement.prototype.highlightedNonCategory = function(categories){
	for(var i = 0; i < this.currentWords.length; i++){
		if(!(categories.indexOf(this.currentWords[i]) >-1)){
			return true;
		}
	}
	return false;
}

Statement.prototype.currCategory = function(){
	return this.category;
}
