Template.cards.created = function () {
	Session.set('isChildActive',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.destroyed = function () {
	Session.set('isChildActive',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.rendered = function () {
	var res=userCards.findOne({is_selected: true,is_root: true});
	$("#"+res._id).trigger('click');
	if(res){
		autoExpandSelected(res._id);
	}
};
Template.cards.helpers({
	usercards: function () {
		return userCards.find({user_id:Meteor.userId(),is_root: true},{sort: {createdAt: 1}});
	}
});
var autoExpandSelected=function(id){
	var expandElem=userCards.findOne({parent_id:id,is_selected: true});
	if(expandElem){
		$("#"+expandElem._id).trigger('click');
		autoExpandSelected(expandElem._id);
	}
}
Template.cards.events({
	'click .inputtitle':function(e,tmpl){
		$('.inputtitle').css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		$(".child-cards-list").remove();
		var childcards= userCards.find({parent_id: this._id},{sort: {createdAt: 1}});
		var data={allchildcards: childcards,parent_id:this._id};
		Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
		userCards.find({is_root: true}).forEach(function (doc) {
			userCards.update({_id: doc._id}, {$set: {is_selected: false}});
		});
		userCards.update({_id: this._id}, {$set: {is_selected: true}});
		autoExpandSelected(this._id);
	},
	'keydown .inputtitle': function (e,tmpl) {
		if(e.keyCode === 9){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this._id,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('click');
			Meteor.call('updatedcardTime', res);
			e.preventDefault(); 
		}
		if(e.keyCode === 13){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('click');
			Meteor.call('updatedcardTime', res);
		}
	},
	'input .inputtitle,paste .inputtitle': function (e,tmpl) {
		var card_text=e.currentTarget.value;
		userCards.update({_id:this._id}, {$set: {cardTitle: card_text}});	
	},
	'click #createRootCard':function(){
		var res=userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,createdAt:Date.now()});
		$("#"+res).focus();
		$("#"+res).trigger('click');
		Meteor.call('updatedcardTime', res);
	}
});

Template.childcardstmpl.events({
	'click .childtitle':function(e,tmpl){
		$('.'+this.parent_id).css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		$(e.currentTarget).parent().nextAll(".child-cards-list").remove();
		var childcards= userCards.find({parent_id: this._id});
		var data={allchildcards: childcards,parent_id:this._id};
		Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
		userCards.find({parent_id: this.parent_id}).forEach(function (doc) {
			userCards.update({_id: doc._id}, {$set: {is_selected: false}});
		});
		userCards.update({_id: this._id}, {$set: {is_selected: true}});
	},
	'keydown .childtitle': function (e,tmpl) {
		if(e.keyCode === 9){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this._id,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('click');
			Meteor.call('updatedcardTime', res);
			e.preventDefault(); 
		}
		if(e.keyCode === 13){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this.parent_id,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('click');
			Meteor.call('updatedcardTime', res);
		}
	},
	'input .childtitle,paste .childtitle': function (e,tmpl) {
		var card_text=e.currentTarget.value;
		userCards.update({_id:this._id}, {$set: {cardTitle: card_text}});	
	},
	'click .createSiblingCard':function(e,tmpl){
		var id=this.parent_id;
		var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:id,createdAt:Date.now()});
		$("#"+res).focus();
		$("#"+res).trigger('click');
		Meteor.call('updatedcardTime', res);
	}
});