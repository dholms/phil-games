var User = function(name, uid, pid, isAdmin) {
	this.name = name;
	this.uid = uid;
	this.pid = pid;
	this.problem;
	this.loggedIn = false;
	this.self = this;
	this.score = {};
	if(this.name && this.uid){
		this.getUser();
	}
}

User.prototype.catRight = function(){this.postScore('catright');}
User.prototype.catWrong = function(){this.postScore('catwrong');}
User.prototype.markRight = function(){this.postScore('markright');}
User.prototype.markWrong = function(){this.postScore('markwrong');}
User.prototype.validRight = function(){this.postScore('validright');}
User.prototype.validWrong = function(){this.postScore('validwrong');}

User.prototype.postScore = function(param){
	if(!this.loggedIn)
		return;

	this.score[param] = this.score[param] + 1;
	var data = {
		UID: this.uid
	}
	data[param] = true;
	$.ajax({
		url: dbUrl + "postScore/",
		type: "GET",
		data:data,
		success: function(response) {
			console.log(response);
		},
		error: function(errors) {
			console.log(response)
		}
	});
	this.displayScore();
}

User.prototype.displayScore = function(){
	var numberify = function(num){
		if(isNaN(num)){
			return 0;
		} else{
			return num;
		}
	}
	var score = this.score;
	score.catpercent = numberify(Math.floor(100*score.catright/(score.catright + score.catwrong)));
	score.markpercent = numberify(Math.floor(100*score.markright/(score.markright + score.markwrong)));
	score.validpercent = numberify(Math.floor(100*score.validright/(score.validright + score.validwrong)));
	html = "Categories Right: " + score.catright +  "<br>";
	html += "Categories Wrong: " + score.catwrong +  "<br>";
	html += "Categories Percent: " + score.catpercent  + "%<br><br>";
	html += "Venns Right: " + score.markright +  "<br>";
	html += "Venns Wrong: " + score.markwrong +  "<br>";
	html += "Venns Percent: " +  score.markpercent +  "%<br><br>";
	html += "Conclusions Right: " + score.validright +  "<br>";
	html += "Conclusions Wrong: " + score.validwrong +  "<br>";
	html += "Conclusions Percent: " +  score.validpercent +  "%<br><br>";
	$('.score-body').html(html);
}

User.prototype.getScore = function(){
	$.ajax({
		url: dbUrl + "getScore/",
		type: 'GET',
		data: {UID: this.uid},
		success: function(response) {
			this.score = response;
			this.displayScore();
		}.bind(this.self),
		error: function(errors) {
			$('.score-body').html("Failure retrieving score");
			console.log(errors);
		}
	});
}

User.prototype.getUser = function(){
	$.ajax({
		url: dbUrl + "user/",
		type: 'GET',
		data: {onyen: this.name, UID: this.uid, PID: this.pid},
		success: function(response) {
			this.loggedIn = true;
			$('.score-header').html("<i>Welcome " + this.name + "!</i>");
			this.score = response.score;
			this.getScore();
		}.bind(this.self),
		error: function(errors) {
			$('.score-header').html("<i>Failed to login. Please try again.</i>")
			console.log(errors);
		}
	});
}

User.prototype.getProblem = function(){
	$.ajax({
		url: dbUrl + "problem/",
		type: 'GET',
		success: function(response) {
			var categories = response.categories.slice(0,3);
			var structure = response.categories.slice(3,4)[0];
			var premises = structure.premises;
			var conclusion = structure.conclusion;
			var problemJSON = {
				categories: categories,
				premises: premises,
				conclusion: conclusion
			}
			// if(this.problem){
			// 	this.problem.tearDown();
			// }
			this.problem = new Problem(problemJSON, this);
		}.bind(this.self),
		error: function(errors) {
			console.log(errors);
		}
	});
}

User.prototype.getLocalProblem = function(){
	var categories = ["Squibs","Muggles","Purebloods"];
	var premises = ["some 1 are 2","some 1 are 3"];
	var conclusion = "some 1 are not 2";
	var problemJSON = {
		categories: categories,
		premises: premises,
		conclusion: conclusion
	}
	this.problem = new Problem(problemJSON, this);
}

User.prototype.addToDB = function(){
	$(ajax)
}
