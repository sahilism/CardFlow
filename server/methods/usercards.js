Meteor.methods({
	createCard: function () {
		var res=userCards.insert({user_id:this.userId,createdAt: Date.now()});
		return res;
	},
	createChildCard:function(parentcard){
		var res=childCards.insert({user_id:this.userId,parentCard:parentcard._id,createdAt: Date.now()});
		return res; 
	}
});			