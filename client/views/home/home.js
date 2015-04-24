Template.home.events({
	'click #logout': function () {
		Meteor.logout()
		Router.go('/');
	}
});
Template.home.onRendered(function(){
	var res=Session.get("creatingAccount");
	if(!res){
		console.log('subscribing');
		return Meteor.subscribe('allusercards');
	}
})