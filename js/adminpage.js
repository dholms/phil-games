var canvas;
var ctx;
var dbUrl = "http://philgames-neta.apps.unc.edu/";

$(document).ready(function(){
	var admin;
	var onyen = getUrlParameter('onyen');
	var uid = getUrlParameter('uid');
	var pid = getUrlParameter('pid')
	if(onyen && uid && pid){
		admin = new Admin(onyen, uid, pid);
	} else{
		window.location.replace('https://dholms.github.io/phil-games/');
	}
	// admin = new Admin('testAdmin',720333020,123456);
	// history.pushState(null, null, "https://dholms.github.io/phil-games/admin.html");
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
