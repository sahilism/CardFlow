Template.home.events({
	'click #logout': function () {
		Meteor.logout()
		Router.go('/');
	},
	'click #toggleNavSearch': function(e, t){
		e.preventDefault();
		$(".nav-search-div").toggle();
		e.stopPropagation();
	}
});
Template.home.onRendered(function(){
	var res=Session.get("creatingAccount");
	if(!res){
		return Meteor.subscribe('allusercards');
	}
});


Template.navbar.onCreated(function(){
	var self = this;
	self.dataDict = new ReactiveDict();
	self.dataDict.set('searchResults', [])
	this.reminders = new ReactiveDict();
	this.reminders.set("ids", []);
	var tmpl = this;
	Meteor.setInterval(function () { 
		var res = userCards.find({user_id: Meteor.userId()});
		res.forEach(function (card) {
			if(_.has(card, "remind_at") && card.remind_at){
				if(card.remind_at < Date.now()){
					var ids = tmpl.reminders.get("ids") || [];
					if(ids.indexOf(card._id) <= -1){
						ids.push(card._id);
						tmpl.reminders.set("ids", ids);	
					}
					
				}
			}
		});
	}, 6000);
})
var reminderFn = function(){
	var ids = [];
	var res = userCards.find({user_id: Meteor.userId()});
	res.forEach(function (card) {
		if(_.has(card, "remind_at") && card.remind_at){
			if(card.remind_at < Date.now()){
				ids.push(card._id);
			}
		}
	});
	return ids;
}
var selectRemainder = function(id){
	if(id !== "root"){
		var card = userCards.findOne({_id: id});
		var res = userCards.findOne({$and: [{user_id: Meteor.userId()},{parent_id: card.parent_id},{is_selected: true}] });
		if(res){
			userCards.update({_id: res._id}, {$set: {is_selected: false}});
		}
		userCards.update({_id: id}, {$set: {is_selected: true}});
		var parent_card = userCards.findOne({_id: card.parent_id});
		if(parent_card){
			selectRemainder(parent_card._id);
		}
	}
}
Template.navbar.helpers({
	remindCount: function(){
		var tmpl = Template.instance();
		var runFn = reminderFn();
		tmpl.reminders.set("ids", runFn);
		var len = tmpl.reminders.get("ids") || [];
		return len.length;
	},
	reminders: function () {
		var tmpl = Template.instance();
		var runFn = reminderFn();
		tmpl.reminders.set("ids", runFn);
		var getIds = tmpl.reminders.get("ids") || [];
		var res= userCards.find({_id: {$in: getIds}},{sort: {remind_at: -1}}).fetch();
		if( res.length > 0){
			return res;
		}
		else{
			return false;
		}
	},
	navSearchResults: function(){
		var t = Template.instance();
		var res = t.dataDict.get('searchResults');
		return res;
	},
	homePage: function(){
		return Router.current().route.getName() === "home"
	}
});

Template.navbar.events({
	'click .remove_reminder': function (e, t) {
		userCards.update({_id: this._id}, {$set: {remind_at: null}});
		e.stopPropagation();
	},
	'click .sel_reminder':function(e, tmpl){
		selectRemainder(this._id);
		$("#"+this._id).focus();
		e.stopPropagation();
	},
	'input #searchCards': function(e, t){
		e.preventDefault();
		var text = e.currentTarget.value;
		if(text){
			var res =  userCards.find({ cardTitle: {$regex: text, $options: 'i'} }, {limit: 5}).fetch();
			t.dataDict.set('searchResults', res)
		}else{
			t.dataDict.set('searchResults', [])
		}
		e.stopPropagation();
	},
	'click #searchResults, click .searh-item': function(e, t){
		e.preventDefault();
		e.stopPropagation();
	},
	'click #goToCard': function(e, t){
		var self = this;
		selectRootId(self._id);
		$(".nav-search-div").toggle();
		t.dataDict.set('searchResults', [])
		$("#searchCards").val("");
		Meteor.setTimeout(function () {
			$("#"+self._id).focus();
		}, 500);
		$('#navDropdown').removeClass('open');
	}
});