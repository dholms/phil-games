var User = function(name, password) {
	this.name = name;
	this.password = password;
	this.problem;
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
			this.problem = new Problem(problemJSON);
		},
		error: function(errors) {
			console.log(errors);
		}
	});
}

User.prototype.addToDB = function(){
	$(ajax)
}