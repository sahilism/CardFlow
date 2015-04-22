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
Template.demoMain.created = function () {
	Session.set("creatingAccount",false);
	if(!Session.get("sessionid")){
		var rid= Random.id();
		Meteor.call('getAdminCards', function (error, result) {
			if(!error){
				result.forEach(function (record) {
					record=_.omit(record, "user_id");
					_.extend(record, {session_id: rid});
					var isExists=demoCards.findOne({_id: record._id});
					if(!isExists){
						demoCards.insert(record);
					}
				});
			}
		});	
		Session.set("sessionid", rid);
		Meteor.subscribe('allSessionCards',rid);
	}
	
};

Template.demoMain.rendered = function () {
	window.onbeforeunload = function(){
	  if(!Session.get("creatingAccount")){
			demoCards.remove();
			Session.set("sessionid",undefined)
		}
	};
};
Template.demoMain.events({
	'click #createAccount': function () {
		Session.set("creatingAccount", true);
		Router.go('/signup');
	},
	'click #createEmptyAccount': function () {
		Session.set("creatingAccount", false);
		Router.go('/signup');
	},
});
Template.demoMain.onDestroyed(function () {
	
});
Template.demo.rendered = function () {
};
Template.demo.helpers({
	userRootCards: function (id) {
		return demoCards.find({session_id: Session.get("sessionid"),parent_id: id},{sort: {createdAt: 1}});
	},
	hasChildren:function(){
		var res=demoCards.findOne({_id: this._id})	
	},
	selected_parent:function(){
		var selectedcard=demoCards.findOne({$and : [{session_id: Session.get("sessionid")},{parent_id: this.id},{is_selected: true}]});
		if(selectedcard){
			return selectedcard._id;
		}
	},
	buttonText:function(){
		if(this.id == "root" && demoCards.find({parent_id: "root"}).count() > 0){
			return "+ Add another card";
		}
		else if(this.id !== "root" && demoCards.find({parent_id: this.id}).count() <= 0){
			return "+ Add a child card";
		}
		else if(this.id !== "root" && demoCards.find({parent_id: this.id}).count() > 0){
			return "+ Add another card";
		}
		else{
			return "Add"
		}
	}
});



Template.demo.events({
	'mouseover .card':function(e,tmpl){
		$(e.currentTarget).children(".sort").css("opacity",1)
	},
	'mouseleave .card':function(e,tmpl){
		$(e.currentTarget).children(".sort").css("opacity",0)
	},
	'mousedown .parent-card-div,touchstart .parent-card-div':function(e,tmpl){
		if(this.is_selected){
			return;
		}
		if(connectionStatus()){
			demoCards.find({$and: [{parent_id: this.parent_id},{is_selected: true}] }).forEach(function (p_id) {
				demoCards.update({_id: p_id._id}, {$set: {is_selected: false}});
			});
			demoCards.update({_id: this._id}, {$set: {is_selected: true}});
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
					markAsUnCompleteDemo(this._id);	
				}
				else{
					markAsCompleteDemo(this._id);
				}
			}
		}
		else if(e.altKey && e.keyCode === 68){
			e.preventDefault();
			var self=this;
			var count=demoCards.find({parent_id: this._id}).count();
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
				            deleteChildCardsDemo(self._id);
				          }
				        }
				    })
				   }
			}
			else{
				deleteChildCardsDemo(this._id);
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
			var hasParent=demoCards.find({parent_id:this._id}).fetch();
			if(hasParent.length > 0){
				var selected_card=demoCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
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
				var count=demoCards.find({session_id: Session.get("sessionid")}).count();
				if(count > 1000){
					toastr.error("You have reached maximum number of cards: 1000");
				}
				else{
					if(connectionStatus()){
						var ps_card=demoCards.findOne({$and: [{parent_id:this._id},{is_selected: true}]});
						if(ps_card){
							demoCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
						}
						demoCards.insert({session_id: Session.get("sessionid"),has_children: false,is_selected:true,parent_id:this._id,createdAt:Date.now()},function(e,r){
							if(!e){
								// Meteor.call('updatedcardTime', r);
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
			var count=demoCards.find({session_id: Session.get("sessionid")}).count();
			if(count > 1000){
				toastr.error("You have reached maximum number of cards: 1000");
			}
			else{
				if(connectionStatus()){
					if(this.parent_id === tmpl.data.id){
						var ps_card=demoCards.findOne({$and: [{parent_id:this.parent_id},{is_selected: true}]});
						if(ps_card){
							demoCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
						}
						var res=demoCards.insert({session_id: Session.get("sessionid"),has_children: false,is_selected:true,parent_id:this.parent_id,createdAt:Date.now()});
							$("#"+res).focus();
							// Meteor.call('updatedcardTime', res);
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
			demoCards.update({_id:this._id}, {$set: {cardTitle: card_text}});
		}
		else{
			return false;
		}
	},
	'click #createRootCard':function(e,tmpl){
		var id=this.id;
		if(id === tmpl.data.id){
			var count=demoCards.find({session_id: Session.get("sessionid")}).count();
			if(count > 1000){
				toastr.error("You have reached maximum number of cards: 1000");
			}
			else{
			 	if(connectionStatus()){
					var ps_card=demoCards.findOne({$and: [{parent_id:id},{is_selected: true}]});
					if(ps_card){
						demoCards.update({_id: ps_card._id}, {$set: {is_selected: false}});
					}
					var res=demoCards.insert({session_id: Session.get("sessionid"),has_children: false,is_selected:true,parent_id:id,createdAt:Date.now()});
					$("#"+res).focus();
					// Meteor.call('updatedcardTime', res);
				}
				else{
					return false;
				}
			}
		}		
	},
	'click #dpMarkAsUnCompl':function(e,tmpl){
		if(this.parent_id === tmpl.data.id){
			markAsUnCompleteDemo(this._id);
		}
	},
	'click #dpMarkAsCompl':function(e,tmpl){
		if(this.parent_id === tmpl.data.id){
			markAsCompleteDemo(this._id);	
		}
	},
	'click #dpDelete':function(e,tmpl){
		e.preventDefault();
		if(this.parent_id === tmpl.data.id){
			var self=this;
			var count=demoCards.find({parent_id: this._id}).count();
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
				            deleteChildCardsDemo(self._id);
				          }
				        }
				    })
				   }
			}
			else{
				deleteChildCardsDemo(this._id);
				// Meteor.call('deleteCard', this._id);
			}
		}
	}
});

var markAsCompleteDemo = function(id){
	demoCards.update({_id: id},{$set: {is_completed: true}});
}
var markAsUnCompleteDemo = function(id){
	demoCards.update({_id: id},{$set: {is_completed: false}});
}

var deleteChildCardsDemo = function(id){
	var count=demoCards.find({parent_id: id}).count();
	if(count > 0){
		demoCards.find({parent_id: id}).fetch().forEach(function (card) {
			deleteChildCardsDemo(card._id);
		});
	}
	demoCards.remove({_id: id});
}