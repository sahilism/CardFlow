Meteor.methods({
	createCard: function () {
		var res=usercards.insert({user_id:this.userId,createdAt: Date.now()});
		return res;
	}
});			