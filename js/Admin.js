var Admin = function(name, uid, pid){
    User.call(this, name, uid, pid);
    this.students = [];
    this.getStudents();
    this.displayStudents();
    $('#makeAdmin').click(this.makeAdmin.bind(this));
    $('#removeAdmin').click(this.removeAdmin.bind(this));
}
Admin.prototype = Object.create(User.prototype);

Admin.prototype.verify = function(){
    return true;
}

Admin.prototype.displayStudents = function(){
    var table = $('.table > tbody');
    table.html('');
    for(var i = 0; i < this.students.length; i++){
        var student = this.students[i];
        table.append(this.tableRow(this.students[i]));
    }
}

Admin.prototype.tableRow = function(student){
    var score = student.score
    var html = "<tr>";
    html += "<th>" + student.pid + "</th>";
    html += "<th>" + score.catRight + "</th>";
    html += "<th>" + score.catWrong + "</th>";
    html += "<th>" + score.markRight + "</th>";
    html += "<th>" + score.markWrong + "</th>";
    html += "<th>" + score.validRight + "</th>";
    html += "<th>" + score.validWrong + "</th>";
    html += "</tr>";
    return html;
}

Admin.prototype.getTerm = function(term){
    $.ajax({
		url: dbUrl + "getTerm/",
		type: 'GET',
		data: {term: term, adminUID: this.uid},
		success: function(response) {
            $('#admin-failure').hide();
			$('#admin-success').show();
		},
		error: function(errors) {
			console.log(errors);
            $('#admin-failure').show();
			$('#admin-success').hide();
		}
	});
}

Admin.prototype.makeAdmin = function(){
    var onyen = $('onyen-input').val();
    $.ajax({
		url: dbUrl + "makeAdmin/",
		type: 'GET',
		data: {onyen: onyen, adminUID: this.uid},
		success: function(response) {
            $('#admin-failure').hide();
			$('#admin-success').show();
		},
		error: function(errors) {
			console.log(errors);
            $('#admin-failure').show();
			$('#admin-success').hide();
		}
	});
}

Admin.prototype.removeAdmin = function(){
    var onyen = $('onyen-input').val();
    $.ajax({
		url: dbUrl + "removeAdmin/",
		type: 'GET',
		data: {onyen: onyen, adminUID: this.uid},
		success: function(response) {
            $('#admin-failure').hide();
			$('#admin-success').show();
		},
		error: function(errors) {
			console.log(errors);
            $('#admin-failure').show();
			$('#admin-success').hide();
		}
	});
}

Admin.prototype.getStudentsNew = function(){
    $.ajax({
		url: dbUrl + "getTerm/",
		type: "GET",
		data:{term:'phil105'},
		success: function(response) {
			console.log(response)
		}.bind(this.self),
		error: function(errors) {
			console.log(errors)
		}
	});
}

Admin.prototype.getStudents = function(){
    var randNum = function(length){
        var result = ""
        for(var i = 0; i < length; i++){
            var int = Math.floor(Math.random() * 10);
            result += int;
        }
        return parseInt(result)
    }
    var randStudent = function(name){
        var student = {
            name: name,
            pid: randNum(9),
            uid: randNum(6),
            score:{
                catRight: Math.floor(Math.random() * 50),
                catWrong: Math.floor(Math.random() * 50),
                markRight: Math.floor(Math.random() * 50),
                markWrong: Math.floor(Math.random() * 50),
                validRight: Math.floor(Math.random() * 50),
                validWrong: Math.floor(Math.random() * 50)
            }
        }
        return student;
    }
    for(var i = 0; i < 50; i++){
        this.students.push(randStudent("test" + (i+1)));
    }
}
