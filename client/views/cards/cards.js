Template.cards.created = function () {
	Session.set('isChildActive',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.destroyed = function () {
	Session.set('isChildActive',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.helpers({
	usercards: function () {
		return userCards.find({user_id:Meteor.userId()},{sort: {createdAt: 1}});
	},
	childCards:function(){
		return Session.get('isChildActive');
	},
	allchildcards:function(){
		var res=Session.get('activeParent');
		return userCards.find({parentCard: res},{sort: {createdAt: 1}});
	}
});

Template.cards.events({
	'focus .inputtitle':function(e,tmpl){
		$('.inputtitle').css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		Session.set('isChildActive',true);
		Session.set('activeParent',this._id);
	},
	'keydown .inputtitle': function (e,tmpl) {
		if(e.keyCode === 9){
			e.preventDefault(); 
			e.stopPropagation();
		}
		if(e.keyCode === 13){
			var id=userCards.insert({user_id:Meteor.userId()},function(e,r){
				if(!e){
					$("#"+r).focus();
				}
			});
		}
	},
	'change .inputtitle': function (e,tmpl) {
		var card_text=e.currentTarget.value;
		userCards.update({_id:this._id}, {$set: {cardTitle: card_text}});	
	}
});