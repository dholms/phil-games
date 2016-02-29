var Statement = function(text) {
	this.text = text;
	this.color = "blue";
	this.category = 1;
	this.currentWords = [];
	this.element = this.createElement(text);
	$('.statements').append(this.element);
};

//Creates the statements element with children elements of type span.word for each word in the statement
//text: (string) the text of the statement
//return: (div.statements) the "statements" element
Statement.prototype.createElement = function(text){
	var element = $('<div class="statement"></div>')
	var words = text.split(" ")
	for(var i=0; i < words.length; i++){
		var word = $('<span class="word">'+words[i]+'</span>')
		this.addWordListeners(word);
		element.append(word);

		var delimeter;
		if(i < words.length-1){
			delimeter = $('<span class="space">&nbsp;</span>');
			this.addWordListeners(delimeter);
		}
		else{
			delimeter = ".";
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
	word.mousedown(this.toggleWord.bind(self));
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
	$(e.currentTarget).toggleClass(this.color);
	var word = e.currentTarget.innerHTML;
	var inArray = $.inArray(word, this.currentWords);
	if(inArray === -1){
		if(word != " " && word != "&nbsp;"){
			this.currentWords.push(word);
		}
	} else{
		this.currentWords.splice(this.currentWords.indexOf(word), 1);
	}
}

//return: array of currently highlighted words
Statement.prototype.returnHighlight = function(){
	return this.currentWords;
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

//Static Methods
Statement.isLetter = function(character){
	var code = character.charCodeAt();
	var isLetter = ((code >= 65) && (code <= 90)) || ((code >= 97) && (code <= 122));
	return letter;
}

Statement.parseWords = function(text){
	var start = 0;
	var words = [];
	for(var i=0; i < text.length; i++){
		var character = text.charAt(i)
		var isLetter = Statement.isLetter(text.charAt(i));
		if(!isLetter){
			if(start != i-1){
				words.push(text.substring(start, i));
			}
			start = i;
		}
	}
}