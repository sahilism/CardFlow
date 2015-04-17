Meteor.publish('allSessionCards', function (id) {
	return demoCards.find({session_id: id});
});