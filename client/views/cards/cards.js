var connectionStatus = function(){
	 if(Meteor.status().connected){
	    return true;
	  }
	  else{
	  	toastr.clear();
	  	toastr.error("you cannot change when you're offline.")
	  	return false;
	  }
}
Template.cards.created = function () {

};
Template.cards.destroyed = function () {
	
};
Template.cards.rendered = function () {
	
};
Template.cards.helpers({
	pinnedCards: function (id) {
		return userCards.find({$and: [ {user_id:Meteor.userId()}, {parent_id: id}, {is_pinned: true} ]},{sort: {createdAt: 1}});
	},
	userRootCards: function (id) {
		return userCards.find({$and: [ {user_id:Meteor.userId()}, {parent_id: id}, {is_pinned: {$ne: true} } ]},{sort: {createdAt: 1}});
	},
	hasChildren:function(){
		var res=userCards.findOne({_id: this._id})	
	},
	selected_parent:function(){
		var selectedcard=userCards.findOne({$and : [{user_id:Meteor.userId()},{parent_id: this.id},{is_selected: true}]});
		if(selectedcard){
			return selectedcard._id;
		}
	},
	buttonText:function(){
		if(this.id == "root" && userCards.find({parent_id: "root"}).count() > 0){
			return "+ Add another card";
		}
		else if(this.id !== "root" && userCards.find({parent_id: this.id}).count() <= 0){
			return "+ Add a child card";
		}
		else if(this.id !== "root" && userCards.find({parent_id: this.id}).count() > 0){
			return "+ Add another card";
		}
		else{
			return "Add"
		}
	}
});



Template.cards.events({
	'mouseover .card':function(e,tmpl){
		$(e.currentTarget).find(".sort").css("opacity",1)
	},
	'mouseleave .card':function(e,tmpl){
		$(e.currentTarget).find(".sort").css("opacity",0)
	},
	'mousedown .parent-card-div':function(e,tmpl){
		if(this.is_selected){
			return;
		}
		if(connectionStatus()){
			userCards.find({$and: [{parent_id: this.parent_id},{is_selected: true}] }).forEach(function (p_id) {
				userCards.update({_id: p_id._id}, {$set: {is_selected: false}});
			});
			userCards.update({_id: this._id}, {$set: {is_selected: true}});
		}
		else{
			return false;
		}
	},
	'keydown .inputtitle': function (e,tmpl) {

		if(e.altKey && e.keyCode === 77){
			e.preventDefault();
			if(this.parent_id === tmpl.data.id){
				if(this.is_completed){
					markAsUnComplete(this._id);	
				}
				else{
					markAsComplete(this._id);
				}
			}
		}
		else if(e.altKey && e.keyCode === 80){
			e.preventDefault();
			if(this.parent_id === tmpl.data.id){
				if(this.is_pinned){
					userCards.update({_id: this._id}, {$set: {is_pinned: false}});	
				}
				else{
					userCards.update({_id: this._id}, {$set: {is_pinned: true}});
				}
			}
		}
		else if(e.altKey && e.keyCode === 68){
			e.preventDefault();
			var self=this;
			var count=userCards.find({parent_id: this._id}).count();
			if(count > 0){
				if(this.parent_id === tmpl.data.id){
					bootbox.confirm({
				        message:"This will permanently delete the card and its children. Okay?",
				        buttons: {
				            'cancel': {
				                label: 'Cancel',
				                className: 'btn-default'
				            },
				            'confirm': {
				                label: 'Delete',
				                className: 'btn-primary'
				            }
				        },
				        callback:function(res){
				          if(res){
				            if(Meteor.user()){
				            	deleteChildCards(self._id);
				              // Meteor.call('deleteCard', self._id);
				            }
				          }
				        }
				    })
				   }
			}
			else{
				deleteChildCards(this._id);
				// Meteor.call('deleteCard', this._id);
			}
		}
		else if(e.shiftKey && e.keyCode === 9){
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
					if(connectionStatus()){
						var ps_card=userCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
						if(ps_card){
							userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
						}
						userCards.insert({user_id:Meteor.userId(),has_children: false,is_selected:true,parent_id:this._id,createdAt:Date.now()},function(e,r){
							if(!e){
								Meteor.call('updatedcardTime', r);
								$("#"+r).focus();
							}
						});
					}
					else{
						return false;
					}
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
				if(connectionStatus()){
					if(this.parent_id === tmpl.data.id){
						var ps_card=userCards.findOne({$and: [{parent_id:this.parent_id},{is_selected: true}]});
						if(ps_card){
							userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
						}
						var res=userCards.insert({user_id:Meteor.userId(),has_children: false,is_selected:true,parent_id:this.parent_id,createdAt:Date.now()});
							$("#"+res).focus();
							Meteor.call('updatedcardTime', res);
					}
				}
				else{
					return false;
				}
			}
			e.preventDefault();
		}
		if(e.keyCode === 38){
			$(e.currentTarget).parent().parent().prev('.card').find("input[type=text]").eq(0).focus();
			$(e.currentTarget).parent().parent().prev('.card').find('.parent-card-div').trigger('mousedown');
		}
		if(e.keyCode === 40){
			$(e.currentTarget).parent().parent().next('.card').find("input[type=text]").eq(0).focus();
			$(e.currentTarget).parent().parent().next('.card').find('.parent-card-div').trigger('mousedown');
		}
	},
	'input .inputtitle,paste .inputtitle': function (e,tmpl) {
		if(connectionStatus()){
			var card_text=e.currentTarget.value;
			userCards.update({_id:this._id}, {$set: {cardTitle: card_text}});
		}
		else{
			return false;
		}
	},
	'click #createRootCard':function(e,tmpl){
		var id=this.id;
		if(id === tmpl.data.id){
			var count=userCards.find({user_id:Meteor.userId()}).count();
			if(count > 1000){
				toastr.error("You have reached maximum number of cards: 1000");
			}
			else{
			 	if(connectionStatus()){
					var ps_card=userCards.findOne({$and: [{parent_id:id},{is_selected: true}]});
					if(ps_card){
						userCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
					}
					var res=userCards.insert({user_id:Meteor.userId(),has_children: false,is_selected:true,parent_id:id,createdAt:Date.now()});
					$("#"+res).focus();
					Meteor.call('updatedcardTime', res);
				}
				else{
					return false;
				}
			}
		}		
	},
	'click #dpMarkAsUnCompl':function(e,tmpl){
		if(this.parent_id === tmpl.data.id){
			markAsUnComplete(this._id);
		}
	},
	'click #dpMarkAsCompl':function(e,tmpl){
		if(this.parent_id === tmpl.data.id){
			markAsComplete(this._id);	
		}
	},
	'click #dpDelete':function(e,tmpl){
		e.preventDefault();
		if(this.parent_id === tmpl.data.id){
			var self=this;
			var count=userCards.find({parent_id: this._id}).count();
			if(count > 0){
				if(this.parent_id === tmpl.data.id){
					bootbox.confirm({
				        message:"This will permanently delete the card and its children. Okay?",
				        buttons: {
				            'cancel': {
				                label: 'Cancel',
				                className: 'btn-default'
				            },
				            'confirm': {
				                label: 'Delete',
				                className: 'btn-primary'
				            }
				        },
				        callback:function(res){
				          if(res){
				            if(Meteor.user()){
				            	deleteChildCards(self._id);
				              // Meteor.call('deleteCard', self._id);
				            }
				          }
				        }
				    })
				   }
			}
			else{
				deleteChildCards(this._id);
				// Meteor.call('deleteCard', this._id);
			}
		}
	},
	'click #pinCard': function(e, tmpl){
		e.preventDefault();
		userCards.update({_id: this._id}, {$set: {is_pinned: true}});
	},
	'click #unpinCard': function(e, tmpl){
		e.preventDefault();
		userCards.update({_id: this._id}, {$set: {is_pinned: false}});
	},
	'click #dropdownMenu2':function(e, tmpl){
		e.preventDefault();
		$("#"+this._id+"_remaind").toggle();;
		e.stopPropagation();
	},
	'click .remind-menu li':function(e,t){
		Meteor.call("addRemainder", this._id, e.currentTarget.id, function(err,res){
			if(!err){
				toastr.success("Reminder added.")
			}
		})
	}
});

var markAsComplete = function(id){
	userCards.update({_id: id},{$set: {is_completed: true}});
}
var markAsUnComplete = function(id){
	userCards.update({_id: id},{$set: {is_completed: false}});
}

var deleteChildCards = function(id){
	var count=userCards.find({parent_id: id}).count();
	if(count > 0){
		userCards.find({parent_id: id}).fetch().forEach(function (card) {
			deleteChildCards(card._id);
		});
	}
	userCards.remove({_id: id});
}