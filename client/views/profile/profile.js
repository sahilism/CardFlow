Template.profile.onCreated(function(){
	Session.set('jsonData', null);
	Meteor.call('getProfileJson', Meteor.userId(), function (error, result) {
		if(error){
		}else{
			console.log(result);
			var obj = result;
			var data = "application/json;," + encodeURIComponent(JSON.stringify(obj, 0, 2));
			$('<a href="data:' + data + '" download="cards.json" style="color:white;font-size: 14px;">Download JSON</a>').appendTo('.downloadDiv');
		}
	});
})
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
	},
	'click #downloadJson': function(e, t){
		Meteor.call('getProfileJson', Meteor.userId(), function (error, result) {
			if(error){
				toastr.error(error.reason);
			}else{
				var obj = result;
				var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
				$('<a href="data:' + data + '" download="cards.json" id="downloadAsFile">download JSON</a>').appendTo('.container');
				Meteor.setTimeout(function () {
					$("#downloadAsFile").click();
				}, 500);
			}
		});
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
	},
	webhook: function(){
		return Meteor.absoluteUrl()+"webhook/"+Meteor.userId()+"/inbox";
	},
});