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

Template.navbar.helpers({
	remindCount: function(){
		var ids = [];
		userCards.find({user_id: Meteor.userId()}).forEach(function (card) {
			if(_.has(card, "remind_at")){
				if(card.remind_at > Date.now()){
					ids.push(card._id);
				}
			}
		});
		return ids.length;
	},
	reminders: function () {
		var ids = [];
		userCards.find({user_id: Meteor.userId()}).forEach(function (card) {
			if(_.has(card, "remind_at")){
				if(card.remind_at > Date.now()){
					ids.push(card._id);
				}
			}
		});
		var res= userCards.find({_id: {$in: ids}}).fetch();
		if( res.length > 0){
			return res;
		}
		else{
			return false;
		}
	}
});

Template.navbar.events({
	'click .remove_reminder': function (e, t) {
		userCards.update({_id: this._id}, {$set: {remind_at: null}});
		e.stopPropagation();
	}
});