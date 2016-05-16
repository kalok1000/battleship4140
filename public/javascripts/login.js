function clicked() {

	var user = document.getElementById('username');
	var pass = document.getElementById('password');
	console.log(user.value);
	console.log(pass.value);
	var coruser = "test";
	var corpass = "123";

	if(user.value == coruser) {

		if(pass.value == corpass) {

			window.alert("You are logged in as " + user.value);
			window.open("http://www.nicksdesk.com");

		} else {

			window.alert("Incorrect username or password!");

		}

	} else {

			window.alert("Incorrect username or password!");

	}

}
