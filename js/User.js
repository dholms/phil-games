var User = function(onyen, uid, pid) {
	this.onyen = onyen;
	this.uid = uid;
	this.pid = pid;
	this.problem;
	this.term = "";
	this.loggedIn = false;
	this.isAdmin = false;
	this.self = this;
	this.score = {};
	if(this.onyen && this.uid){
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

User.prototype.addAdminbutton = function(){
	var parameters = "?onyen=" + this.onyen +"&pid=" + this.pid + "&uid=" + this.uid;
	$('.title-buttons').append('<a href="admin.html' + parameters + '"><button class="btn btn-primary">Admin</button></a>');
}

User.prototype.displayTerm = function(){
	$('.term-body').show();
	$('#current-term').html(this.term);
	$('#update-term').click(this.assignTerm.bind(this));
}

User.prototype.assignTerm = function(){
	var newTerm = $('#term-input').val();
	$.ajax({
		url: dbUrl + "assignTerm/",
		type: "GET",
		data:{UID:this.uid, term:newTerm},
		success: function(response) {
			this.term = newTerm;
			$('#current-term').html(this.term);
			$('#term-alert').html('<i>Successfully Added</i>');
		}.bind(this.self),
		error: function(errors) {
			console.log(errors)
			$('#term-alert').html('<i class="error">Term does not exist.</i>')
		}
	});
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
	html += "Conclusions Percent: " +  score.validpercent +  "%<br>";
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
		data: {onyen: this.onyen, UID: this.uid, PID: this.pid},
		success: function(response) {
			this.loggedIn = true;
			$('.score-header').html("<i>Welcome " + this.onyen + "!</i>");
			this.score = response.score;
			this.term = response.term;
			this.isAdmin = response.isAdmin
			this.getScore();
			if(!this.isAdmin){
				this.displayTerm();
			} else{
				this.addAdminbutton();
			}
		}.bind(this.self),
		error: function(errors) {
			$('.score-header').html("<span class='error'>Failed to login. Please try again.</span>");
			console.log(errors);
		}
	});
}

User.prototype.getProblem = function(dif){

	if (dif == 'easy' || dif == 'medium' || dif == 'hard'){
		$.ajax({
			url: dbUrl + "problem/",
			type: 'GET',
			data:{difficulty: dif},
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
	else{
		$.ajax({
			url: dbUrl + "problem/",
			type: 'GET',
			data:{difficulty: 'easy'},
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
}

User.prototype.getLocalProblem = function(){
	var categories = [{'plural':"squibs"},{'plural':"muggles"},{'plural':"purebloods"}];
	var premises = ["some 1 and 2 exist","no 2 are 3"];
	var conclusion = "some 1 exist";
	var problemJSON = {
		categories: categories,
		premises: premises,
		conclusion: conclusion
	}
	this.problem = new Problem(problemJSON, this);
}
