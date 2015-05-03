Template.home.events({
	'click #logout': function () {
		Meteor.logout()
		Router.go('/');
	}
});
Template.home.onRendered(function(){
	var res=Session.get("creatingAccount");
	if(!res){
		return Meteor.subscribe('allusercards');
	}
});


Template.navbar.onCreated(function(){
	this.reminders = new ReactiveDict();
	this.reminders.set("ids", [])
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
Template.navbar.helpers({
	remindCount: function(){
		var tmpl = Template.instance();
		var runFn = reminderFn();
		tmpl.reminders.set("ids", runFn);
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
		var len = tmpl.reminders.get("ids") || [];
		return len.length;
	},
	reminders: function () {
		var tmpl = Template.instance();
		var runFn = reminderFn();
		tmpl.reminders.set("ids", runFn);
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
		
		var getIds = tmpl.reminders.get("ids") || [];
		var res= userCards.find({_id: {$in: getIds}}).fetch();
		if( res.length > 0){
			return res;
		}
		else{
			return false;
		}
	}
});

Template.navbar.events({
	'click .remove_reminder': function (e, t) {
		userCards.update({_id: this._id}, {$set: {remind_at: null}});
		e.stopPropagation();
	}
});