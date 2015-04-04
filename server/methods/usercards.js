Meteor.methods({
	createCard: function () {
		var res=userCards.insert({user_id:this.userId,createdAt: Date.now()});
		return res;
	},
	createChildCard:function(parentcard){
		var childcard={parentCard:parentcard._id,createdAt: Date.now()};
		var res=userCards.update({user_id: this.userId}, {$push: {child: childcard}});
		return res; 
	},
	updatedcardTime:function(id){
		return userCards.update({_id:id}, {createdAt: Date.now()});
	}
});