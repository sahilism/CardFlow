Template.admin.created = function () {
	Session.setDefault("accountsCount",0);
	Session.setDefault("cardsCount",0);
};
Template.admin.helpers({
	noOfAccounts: function () {
		Meteor.call('getAccountsCount', Meteor.userId(), function (error, result) {
			Session.set("accountsCount", result);
		});
		return Session.get("accountsCount");
	},
	noOfCards:function(){
		Meteor.call('getCardsdCount', Meteor.userId(), function (error, result) {
			Session.set("cardsCount", result);
		});
		return Session.get("cardsCount");
	},
	Logs:function(){
		return Logs.find({},{sort: {timestamp: -1}}).fetch();
	}
});