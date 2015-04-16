Template.profile.events({
	'click #resetAccount': function (e,tmpl) {
		e.preventDefault();
		var digest = Package.sha.SHA256($('#confirmPass').val());
	    Meteor.call('checkPasswordandReset', digest, function(err, result) {
	      if (result) {
	        toastr.success("Account reset.");
	        $("#removeCards").modal('hide');
	        Session.set("userCardsCount", 0);
	      }
	      else{
	      	toastr.error(err.message)
	      }
	    });
	},
	'click #goHome':function(){
		Router.go('home');
	}
});
Template.profile.created = function () {
	Session.setDefault("userCardsCount",0);
};
Template.profile.helpers({
	getEmail: function () {
		var user=Meteor.user();
		if(user && _.has(user,"emails") && user.emails.length > 0){
			return user.emails[0].address;
		}
	},
	noOfUserCards:function(){
		Meteor.call('getUserCarsdCount', Meteor.userId(), function (error, result) {
			Session.set("userCardsCount", result);
		});
		return Session.get("userCardsCount");
	}
});