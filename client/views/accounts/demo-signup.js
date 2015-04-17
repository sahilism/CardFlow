Template.signupDemo.events({
	'click #createAcc': function (e,tmpl) {
		e.preventDefault();
		var email=tmpl.$("#createEmail").val();
		var pswd=tmpl.$("#createPass").val();
		var repswd=tmpl.$("#createPassAgain").val();

		if(!email || !pswd || !repswd){
			Session.set("createErrors", "All fields are mandatory.");
			return;
		}

		if(pswd !== repswd){
			Session.set("createErrors", "Passwords doesn't match");
			return;
		}
		console.log('calling create use');
		console.log(email,pswd);
		Accounts.createUser({
			email: email,
			password: pswd,
		}, function (e) {
			console.log('callback',e);
			if(e){
				Session.set("createErrors", e.reason);
			}
			else{
				Router.go("/");
			}
		});
	}
});

Template.signupDemo.helpers({
	createErrors: function () {
		return Session.get("createErrors");
	}
});