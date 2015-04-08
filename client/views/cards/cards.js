Template.cards.created = function () {
	Session.set('activeChild',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.destroyed = function () {
	Session.set('activeChild',undefined);
	Session.set('activeParent',undefined);
};
Template.cards.rendered = function () {
	var res=userCards.findOne({$and: [{user_id:Meteor.userId()},{is_selected: true},{is_root: true}]});
	if(res){
		Session.set('activeParent',res._id);
		$("#"+res._id).trigger('mousedown');
	}
};
Template.childcardstmpl.rendered = function () {
};
getParentCardSelect = function(id){
	var newcard= userCards.findOne({_id:id});
	if(newcard && _.has(newcard,"parent_id")){
		var r=userCards.findOne({_id:newcard.parent_id});
		if(r.is_selected){
			return getParentCardSelect(r.parent_id)
		}
		else{
			userCards.find({parent_id:newcard.parent_id}).forEach(function (doc) {
				userCards.update({_id:doc._id},{$set:{is_selected: false}})
			});
			userCards.update({_id:newcard._id}, {$set: {is_selected: true}});
		}
	}
	else{
		return newcard._id;
	}
}
getParentCard = function(id){
	var newcard= userCards.findOne({_id:id});
	if(newcard && _.has(newcard,"parent_id")){
		/*var r=userCards.findOne({_id:newcard.parent_id});
		if(r && r.is_selected){*/
			return getParentCard(newcard.parent_id);
		/*}
		else{
			return false;
		}*/
	}
	else{
		return newcard._id;
	}
}
Template.cards.helpers({
	usercards: function () {
		return userCards.find({user_id:Meteor.userId(),is_root: true},{sort: {createdAt: 1}});
	}
});
var autoExpandSelected=function(id){
	var expandElem=userCards.findOne({$and: [{parent_id: id},{is_selected: true}]});
	if(expandElem){
		expandChildCards(expandElem);
		autoExpandSelected(expandElem._id);
	}
}
var expandChildCards=function(elem){
	$('.'+elem.parent_id).parent().css('background', '#fff');
	$("#"+elem._id).parent().css('background', 'lightyellow');
	$("#"+elem._id).parent().parent().nextAll(".child-cards-list").remove();
	var childcards= userCards.find({parent_id: elem._id},{sort: {createdAt: 1}});
	var data={allchildcards: childcards,parent_id:elem._id};
	Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
	userCards.find({parent_id: elem.parent_id,is_selected: true}).forEach(function (doc) {
		userCards.update({_id: doc._id}, {$set: {is_selected: false}});
	});
	userCards.update({_id: elem._id}, {$set: {is_selected: true}});
}
Template.cards.events({
	'mousedown .parent-card-div,touchstart .parent-card-div':function(e,tmpl){
		$('.parent-card-div').css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		$(".child-cards-list").remove();
		Session.set('activeParent',this._id);
		var childcards= userCards.find({parent_id: this._id},{sort: {createdAt: 1}});
		var data={allchildcards: childcards,parent_id:this._id};
		Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
		var p_id=userCards.findOne({$and: [{is_root: true},{is_selected: true}] });
		if(p_id){
			userCards.update({_id: p_id._id}, {$set: {is_selected: false}});
		}
		userCards.update({_id: this._id}, {$set: {is_selected: true}});
		autoExpandSelected(this._id);
	},
	'keydown .inputtitle': function (e,tmpl) {
		if(e.shiftKey && e.keyCode === 9){
			e.preventDefault();
		}
		else if(e.keyCode === 9){
			var hasParent=userCards.find({parent_id:this._id}).fetch();
			if(hasParent.length > 0){
				var selected_card=userCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
				if(selected_card){
					$("#"+selected_card._id).parent().find("input[type=text]").eq(0).focus();
					$("#"+selected_card._id).parent().trigger('mousedown');
				}
				else{
					$("#"+hasParent[0]._id).parent().find("input[type=text]").eq(0).focus();
					$("#"+hasParent[0]._id).parent().trigger('mousedown');
				}
			}
			else{
				var count=userCards.find({user_id:Meteor.userId()}).count();
				if(count > 1000){
					toastr.error("You have reached maximum number of cards: 1000");
				}
				else{
					var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this._id,createdAt:Date.now()});
					$("#"+res).focus();
						$("#"+res).parent().trigger('mousedown');
						Meteor.call('updatedcardTime', res);
				}
			}
			e.preventDefault(); 
		}
		if(e.keyCode === 13){
			var count=userCards.find({user_id:Meteor.userId()}).count();
			if(count > 1000){
				toastr.error("You have reached maximum number of cards: 1000");
			}
			else{
				var res=userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,createdAt:Date.now()});
				$("#"+res).focus();
				$("#"+res).parent().trigger('mousedown');
				Meteor.call('updatedcardTime', res);
			}
		}
		if(e.keyCode === 38){
			$(e.currentTarget).parent().prev('.parent-card-div').find("input[type=text]").eq(0).focus();
			$(e.currentTarget).parent().prev('.parent-card-div').trigger('mousedown');
		}
		if(e.keyCode === 40){
			$(e.currentTarget).parent().next('.parent-card-div').find("input[type=text]").eq(0).focus();
			$(e.currentTarget).parent().next('.parent-card-div').trigger('mousedown');
		}
	},
	'input .inputtitle,paste .inputtitle': function (e,tmpl) {
		var card_text=e.currentTarget.value;
		userCards.update({_id:this._id}, {$set: {cardTitle: card_text}});	
	},
	'click #createRootCard':function(){
		var count=userCards.find({user_id:Meteor.userId()}).count();
		if(count > 1000){
			toastr.error("You have reached maximum number of cards: 1000");
		}
		else{
			var res=userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).parent().trigger('mousedown');
			Meteor.call('updatedcardTime', res);
		}
	}
});

Template.childcardstmpl.events({
	/*'mousedown .card':function(){
		$("#"+this._id).trigger('mousedown');
	},*/
	'mousedown .child-card-div,touchstart .child-card-div':function(e,tmpl){
		$('.'+this.parent_id).parent().css('background', '#fff');
		$(e.currentTarget).css('background', 'lightyellow');
		$(e.currentTarget).parent().nextAll(".child-cards-list").remove();
		var childcards= userCards.find({parent_id: this._id},{sort: {createdAt: 1}});
		var data={allchildcards: childcards,parent_id:this._id};
		Blaze.renderWithData(Template.childcardstmpl, data, $(".childcards-container")[0]);
		autoExpandSelected(this._id);
		userCards.find({parent_id: this.parent_id,is_selected: true}).forEach(function (doc) {
			userCards.update({_id: doc._id}, {$set: {is_selected: false}});
		});
		userCards.update({_id: this._id}, {$set: {is_selected: true}});
	},
	'keydown .childtitle': function (e,tmpl) {
		if(e.shiftKey && e.keyCode === 9){
			if(_.has(this,"parent_id")){
				$("#"+this.parent_id).parent().find("input[type=text]").focus()[0];
			}
			e.preventDefault();
		}
		else if(e.keyCode === 9){
			console.log('tab key');
			var hasParent=userCards.find({parent_id:this._id}).fetch();
			if(hasParent.length > 0){
				var selected_card=userCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
				if(selected_card){
					$("#"+selected_card._id).parent().find("input[type=text]").eq(0).focus();
					$("#"+selected_card._id).parent().trigger('mousedown');
				}
				else{
					$("#"+hasParent[0]._id).parent().find("input[type=text]").eq(0).focus();
					$("#"+hasParent[0]._id).parent().trigger('mousedown');
				}
			}
			else{
				var count=userCards.find({user_id:Meteor.userId()}).count();
				if(count > 1000){
					toastr.error("You have reached maximum number of cards: 1000");
				}
				else{
					var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this._id,createdAt:Date.now()});
					$("#"+res).focus();
					$("#"+res).parent().trigger('mousedown');
					Meteor.call('updatedcardTime', res);
				}	
			}
			
			e.preventDefault(); 
		}
		if(e.keyCode === 13){
			var count=userCards.find({user_id:Meteor.userId()}).count();
			if(count > 1000){
				toastr.error("You have reached maximum number of cards: 1000");
			}
			else{
				var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:this.parent_id,createdAt:Date.now()});
				$("#"+res).focus();
					$("#"+res).parent().trigger('mousedown');
					Meteor.call('updatedcardTime', res);
			}
		}
		if(e.keyCode === 38){
			$(e.currentTarget).parent().prev('.child-card-div').find("input[type=text]").eq(0).focus();
			$(e.currentTarget).parent().prev('.child-card-div').trigger('mousedown');
		}
		if(e.keyCode === 40){
			$(e.currentTarget).parent().next('.child-card-div').find("input[type=text]").eq(0).focus();
			$(e.currentTarget).parent().next('.child-card-div').trigger('mousedown');
		}
	},
	'input .childtitle,paste .childtitle': function (e,tmpl) {
		var card_text=e.currentTarget.value;
		userCards.update({_id:this._id}, {$set: {cardTitle: card_text}});	
	},
	'click .createSiblingCard':function(e,tmpl){
		var id=this.parent_id;
		var count=userCards.find({user_id:Meteor.userId()}).count();
		if(count > 1000){
			toastr.error("You have reached maximum number of cards: 1000");
		}
		else{
		 	var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,parent_id:id,createdAt:Date.now()});
			$("#"+res).focus();
			$("#"+res).parent().trigger('mousedown');
			Meteor.call('updatedcardTime', res);		
		}		
	}
});