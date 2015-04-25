Template.home.events({
	'click #logout': function () {
		Meteor.logout()
		Router.go('/');
	}
});
Template.home.onRendered(function(){
	var res=Session.get("creatingAccount");
	if(!res){
		return Meteor.subscribe('allusercards');
	}
})