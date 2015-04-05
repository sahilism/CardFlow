Template.cards.created = function () {
	Session.set('activeChild',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.destroyed = function () {
	Session.set('activeChild',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.rendered = function () {
	var res=userCards.find({is_selected: true,is_root: true});
	res=res.fetch()[0];
	Session.set('activeParent',res._id);
	$("#"+res._id).trigger('mousedown');
};
Template.childcardstmpl.rendered = function () {
	userCards.find({is_selected: true,is_root: true}).observe({
		added: function (newDocument) {
			var card=userCards.findOne({is_selected: true,is_root: true});
			var existingParent=Session.get('activeParent');
			if(newDocument._id !== existingParent){
				Session.set('activeParent',card._id);
				$("#"+card._id).trigger('mousedown');
				autoExpandSelected(newDocument._id);
			}
		}
	});
	/*userCards.find({is_root: {$ne: true}}).observe({
		changed: function (newDocument,old) {
			if(newDocument.is_selected && !newDocument.is_root && !old.is_selected){
				var pid=getParentCard(newDocument._id);
				var pcard=userCards.findOne({_id:pid});
				if(pcard && pcard.is_selected){
					console.log(newDocument);
				}
			}
				
		}
	});*/
};
getParentCard = function(id){
	var newcard= userCards.findOne({_id:id});
	if(newcard && _.has(newcard,"parent_id")){
		return getParentCard(newcard.parent_id);
	}
	else{
		return newcard._id;
	}
}
Template.cards.helpers({
	usercards: function () {
		return userCards.find({user_id:Meteor.userId(),is_root: true},{sort: {createdAt: 1}});
	},
	expandChildren:function(){

	}
});
var autoExpandSelected=function(id){
	var expandElem=userCards.findOne({parent_id:id,is_selected: true});
	if(expandElem){
		// $("#"+expandElem._id).trigger('click');
		expandChildCards(expandElem);
		autoExpandSelected(expandElem._id);
	}
}
var expandChildCards=function(elem){
	$('.'+elem.parent_id).css('background', '#fff');
	$("#"+elem._id).css('background', 'lightyellow');
	$("#"+elem._id).parent().nextAll(".child-cards-list").remove();
	var childcards= userCards.find({parent_id: elem._id},{sort: {createdAt: 1}});
	var data={allchildcards: childcards,parent_id:elem._id};
	Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
	userCards.find({parent_id: elem.parent_id}).forEach(function (doc) {
		userCards.update({_id: doc._id}, {$set: {is_selected: false}});
	});
	userCards.update({_id: elem._id}, {$set: {is_selected: true}});
}
Template.cards.events({
	'mousedown .inputtitle':function(e,tmpl){
		$('.inputtitle').css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		$(".child-cards-list").remove();
		Session.set('activeParent',this._id);
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
			$("#"+res).trigger('mousedown');
			Meteor.call('updatedcardTime', res);
			e.preventDefault(); 
		}
		if(e.keyCode === 13){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('mousedown');
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
		$("#"+res).trigger('mousedown');
		Meteor.call('updatedcardTime', res);
	}
});

Template.childcardstmpl.events({
	'mousedown .childtitle':function(e,tmpl){
		$('.'+this.parent_id).css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		$(e.currentTarget).parent().nextAll(".child-cards-list").remove();
		var childcards= userCards.find({parent_id: this._id},{sort: {createdAt: 1}});
		var data={allchildcards: childcards,parent_id:this._id};
		Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
		userCards.find({parent_id: this.parent_id}).forEach(function (doc) {
			userCards.update({_id: doc._id}, {$set: {is_selected: false}});
		});
		userCards.update({_id: this._id}, {$set: {is_selected: true}});
		autoExpandSelected(this._id);
	},
	'keydown .childtitle': function (e,tmpl) {
		if(e.keyCode === 9){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this._id,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('mousedown');
			Meteor.call('updatedcardTime', res);
			e.preventDefault(); 
		}
		if(e.keyCode === 13){
			var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this.parent_id,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).trigger('mousedown');
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
		$("#"+res).trigger('mousedown');
		Meteor.call('updatedcardTime', res);
	}
});