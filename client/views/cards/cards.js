Template.cards.helpers({
	usercards: function () {
		return usercards.find({user_id:Meteor.userId()});
	}
});

Template.cards.events({
	'keyup .inputtitle': function (e,tmpl) {
		var card_text=e.currentTarget.value;
		usercards.update({_id:this._id}, {$set: {card: {title: card_text}}});
	}
});