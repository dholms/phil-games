var canvas;
var ctx;
var dbUrl = "http://philgames-neta.apps.unc.edu/";

$(document).ready(function(){
	canvas = document.getElementById("c");
	ctx = canvas.getContext("2d");
	var user;
	var status = getUrlParameter('status')
	if(status === 'pass'){
		var onyen = getUrlParameter('onyen');
		var uid = getUrlParameter('uid');
		var pid = getUrlParameter('pid')
		user = new User(onyen, uid, pid);
	} else{
		user = new User();
		if(status === 'fail'){
			$('.score-header').html("<span class='error'>Failed to login. Please try again.</span>");
		}
	}
	// history.pushState(null, null, "http://dholms.github.io/phil-games/");
	user.getProblem();
});

var getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
