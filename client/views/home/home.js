Template.home.events({
	'click #logout': function () {
		Meteor.logout()
		Router.go('/');
	}
});