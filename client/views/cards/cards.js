Template.cards.helpers({
	usercards: function () {
		return usercards.find({user_id:Meteor.userId()},{sort: {createdAt: 1}});
	}
});

Template.cards.events({
	'keyup .inputtitle': function (e,tmpl) {
		if(e.keyCode === 13){
			Meteor.call('createCard',function(e,r){
				if(!e){
					$("#"+r).focus();
				}
			});
		}
		else{
			var card_text=e.currentTarget.value;
			usercards.update({_id:this._id}, {$set: {cardTitle: card_text}});	
		}
	}
});