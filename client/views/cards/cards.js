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
		return userCards.find({user_id:Meteor.userId(),is_root: true},{sort: {createdAt: 1}});
	},
	childCards:function(){
		return Session.get('isChildActive');
	},
	allchildcards:function(){
		var res=Session.get('activeParent');
		if(res){
			return userCards.find({parent_id: res,is_root: false},{sort: {createdAt: 1}});	
		}
	}
});

Template.cards.events({
	'focus .inputtitle':function(e,tmpl){
		$('.inputtitle').css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		Session.set('activeParent',this._id);
	},
	'keydown .inputtitle': function (e,tmpl) {
		if(e.keyCode === 9){
			e.preventDefault(); 
			e.stopPropagation();
			userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this._id},function(e,r){
				if(!e){
					$("#"+r).focus();
					Meteor.call('updatedcardTime', r);
				}
			});
		}
		if(e.keyCode === 13){
			userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,createdAt:Date.now()},function(e,r){
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