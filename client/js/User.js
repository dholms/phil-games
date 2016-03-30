var User = function(name, pid, isAdmin) {
	this.name = name;
	this.pid = pid;
	this.problem;
	this.loggedIn = false;
	if(this.name && this.pid){
		this.loggedIn = true;
	}
}

User.prototype.login = function(){
	//if no user, then do nothing
	if(!this.loggedIn){
		return;
	}
	$('.panel-body').html("<i>Welcome " + this.name + "!</i>");
}

User.prototype.getProblem = function(){
	$.ajax({
		url: dbUrl,
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
			this.problem = new Problem(problemJSON, this);
		},
		error: function(errors) {
			console.log(errors);
		}
	});
}

User.prototype.addToDB = function(){
	$(ajax)
}