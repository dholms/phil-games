var Admin = function(onyen, uid, pid){
    this.self = this;
    this.onyen = onyen;
	this.uid = uid;
	this.pid = pid;
    this.students = [];
    this.terms = [];
    this.verify();
    this.getTerms();
    this.addListeners();
}

Admin.prototype.verify = function(){
    if(!this.onyen || !this.uid || !this.pid){
        this.redirect();
        return;
    }
    $.ajax({
        url: dbUrl + 'verifyAdmin/',
        type: 'GET',
        data:{UID: this.uid},
        success: function(response){
            if(response.isAdmin){
                this.addGameButton();
                this.getTerms()
            } else{
                this.redirect();
            }
        }.bind(this),
        error: function(errors){
            this.redirect();
        }.bind(this)
    })
}

Admin.prototype.addGameButton = function(){
    var parameters = "?status=pass&onyen=" + this.onyen +"&pid=" + this.pid + "&uid=" + this.uid;
	$('.title-buttons').append('<a href="index.html' + parameters + '"><button class="btn btn-primary">Back To Game</button></a>');
}

Admin.prototype.redirect = function(){
    alert('Sorry. You are not an admin.');
    window.location.replace('http://dholms.github.io/phil-games/');
}

Admin.prototype.addListeners = function(){
    $('#makeAdmin').click(this.makeAdmin.bind(this));
    $('#removeAdmin').click(this.removeAdmin.bind(this));
    $('#createTerm').click(this.createTerm.bind(this));
    $('#term-select').change(this.selectTerm.bind(this));
}

Admin.prototype.displayTerms = function(){
    if(this.terms.length === 0 || this.terms[0] == null){
        return;
    }
    var selectHtml = "";
    for(var i = 0; i < this.terms.length; i++){
        selectHtml += "<option>" + this.terms[i] + "</option>"
    }
    $("#term-select").html(selectHtml);
    $('#term-select').val(this.terms[this.terms.length-1]);
    this.selectTerm()
}

Admin.prototype.selectTerm = function(){
    term = $('#term-select').val();
    $('.current-term').html(term);
    this.getTerm(term);
}

Admin.prototype.displayStudents = function(){
    var table = $('.table > tbody');
    table.html('');
    for(var i = 0; i < this.students.length; i++){
        var student = this.students[i];
        table.append(this.tableRow(this.students[i]));
    }
    $('tr').mouseover(function(){
            $(this).tooltip({placement:'left'});
            $(this).tooltip('show');
    });
}

Admin.prototype.tableRow = function(student){
    var score = student.score
    var html = "<tr data-toggle='tooltip' title='" + student.onyen +"'>";
    html += "<th>" + student.PID + "</th>";
    html += "<th>" + score.catright + "</th>";
    html += "<th>" + score.catwrong + "</th>";
    html += "<th>" + score.markright + "</th>";
    html += "<th>" + score.markwrong + "</th>";
    html += "<th>" + score.validright + "</th>";
    html += "<th>" + score.validwrong + "</th>";
    html += "</tr>";
    return html;
}

Admin.prototype.createTerm = function(){
    var term = $('#term-input').val();
    $.ajax({
        url: dbUrl + 'createTerm/',
        type: 'GET',
        data: {UID: this.uid, term:term},
        success: function(response) {
            console.log(response);
            this.getTerms();
            $('#term-success').show();
            $('#term-failure').hide();
		}.bind(this.self),
		error: function(errors) {
			console.log(errors);
            $('#term-success').hide();
            $('#term-failure').show();
		}
    });
}

Admin.prototype.getTerms = function(){
    $.ajax({
        url: dbUrl + 'getTerms/',
        type: 'GET',
        data: {UID: this.uid},
        success: function(response) {
            this.terms = response.term;
            this.displayTerms();
		}.bind(this),
		error: function(errors) {
			console.log(errors);
		}
    });
}

Admin.prototype.getTerm = function(term){
    $.ajax({
		url: dbUrl + "getTerm/",
		type: 'GET',
		data: {term: term, UID: this.uid},
		success: function(response) {
            this.students = response.users;
            this.displayStudents();
            console.log(response);
		}.bind(this),
		error: function(errors) {
			// console.log(errors);
		}
	});
}

Admin.prototype.makeAdmin = function(){
    var onyen = $('#onyen-input').val();
    $.ajax({
		url: dbUrl + "makeAdmin/",
		type: 'GET',
		data: {onyen: onyen, UID: this.uid},
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

Admin.prototype.getStudents = function(){
    $.ajax({
		url: dbUrl + "getTerm/",
		type: "GET",
		data:{term:'phil105'},
		success: function(response) {
            this.students = response.users;
			this.displayStudents().bind(this);
		}.bind(this.self),
		error: function(errors) {
			this.students = [];
            // console.log(errors);
		}
	});
}

Admin.prototype.getStudentsOld = function(term){
    var randNum = function(length){
        var result = ""
        for(var i = 0; i < length; i++){
            var int = Math.floor(Math.random() * 10);
            result += int;
        }
        return parseInt(result)
    }
    var randStudent = function(onyen){
        var student = {
            onyen: onyen,
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
