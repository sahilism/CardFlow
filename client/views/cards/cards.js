Template.cards.created = function () {

};
Template.cards.destroyed = function () {
	
};
Template.cards.rendered = function () {

};
Template.childcardstmpl.rendered = function () {

};
Template.cards.helpers({
	userRootCards: function () {
		return userCards.find({user_id:Meteor.userId(),is_root: true},{sort: {createdAt: 1}});
	},
	hasChildren:function(){
		var res=userCards.findOne({_id: this._id})	
	},
	isSelected_have_children:function(){
		var selectedcard=userCards.findOne({$and : [{user_id:Meteor.userId()},{is_root: true},{is_selected: true}]});
		if(selectedcard){
			var res=userCards.find({parent_id: selectedcard._id}).count();
			if(res > 0){
				return true;
			}
			else{
				return false;
			}
		}
		else{
			return false;
		}
	},
	selected_parent:function(){
		var selectedcard=userCards.findOne({$and : [{user_id:Meteor.userId()},{is_root: true},{is_selected: true}]});
		if(selectedcard){
			return selectedcard._id;
		}
		else{
			var r= userCards.findOne({is_root: true},{sort: {createdAt: 1}});
			if(r && _.has(r,"_id")){
				return r._id;
			}
		}
	}
});
Template.cards.events({
	'mousedown .parent-card-div,touchstart .parent-card-div':function(e,tmpl){
		if(this.is_selected){
			return;
		}
		var p_id=userCards.findOne({$and: [{is_root: true},{is_selected: true}] });
		if(p_id){
			userCards.update({_id: p_id._id}, {$set: {is_selected: false}});
		}
		userCards.update({_id: this._id}, {$set: {is_selected: true}});
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
					var ps_card=userCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
					if(ps_card){
						userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
					}
					userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,is_selected:true,parent_id:this._id,createdAt:Date.now()},function(e,r){
						if(!e){
							Meteor.call('updatedcardTime', r);
							$("#"+r).focus();
						}
					});
					
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
			var s_card=userCards.findOne({$and: [{is_root: true},{is_selected:true}]});

			if(s_card){
				userCards.update({_id:s_card._id}, {$set: {is_selected: false}});
			}
			var res=userCards.insert({user_id:Meteor.userId(),is_root: true,has_children: false,is_selected:true,createdAt:Date.now()});
			$("#"+res).focus();
			Meteor.call('updatedcardTime', res);
		}
	}
});

Template.childcardstmpl.helpers({
	selected_children: function (id) {
		return userCards.find({parent_id: id});
	},
	isSelected_have_children:function(id){
		var res=userCards.find({$and: [{parent_id:id},{is_selected:true}]}).count();
		if(res > 0){
			return true;
		}
		else{
			return false;
		}
	},
	selected_child:function(id){
		return userCards.findOne({$and: [{parent_id:id},{is_selected:true}]});
	}
});
Template.childcardstmpl.events({
	'mousedown .child-card-div,touchstart .child-card-div':function(e,tmpl){
		if(this.is_selected){
			return;
		}
		var p_id=userCards.findOne({$and: [{parent_id: this.parent_id},{is_selected: true}] });
		if(p_id){
			userCards.update({_id: p_id._id}, {$set: {is_selected: false}});
		}
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
					var ps_card=userCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
					if(ps_card){
						userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
					}
					userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,is_selected:true,parent_id:this._id,createdAt:Date.now()},function(e,r){
						if(!e){
							Meteor.call('updatedcardTime', r);
							$("#"+r).focus();
						}
					});
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
				if(this.parent_id === tmpl.data.id){
					var ps_card=userCards.findOne({$and: [{parent_id:this.parent_id},{is_selected: true}]});
					if(ps_card){
						userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
					}
					var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,is_selected:true,parent_id:this.parent_id,createdAt:Date.now()});
						$("#"+res).focus();
						Meteor.call('updatedcardTime', res);
				}
			}
			e.preventDefault();
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
		var id=this.id;
		if(id === tmpl.data.id){
			var count=userCards.find({user_id:Meteor.userId()}).count();
			if(count > 1000){
				toastr.error("You have reached maximum number of cards: 1000");
			}
			else{
			 	
				var ps_card=userCards.findOne({$and: [{parent_id:id},{is_selected: true}]});
				if(ps_card){
					userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
				}
				var res=userCards.insert({user_id:Meteor.userId(),is_root: false,has_children: false,is_selected:true,parent_id:id,createdAt:Date.now()});
				$("#"+res).focus();
				Meteor.call('updatedcardTime', res);		
			}
		}		
	}
});