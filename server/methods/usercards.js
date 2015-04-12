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
		return userCards.update({_id:id}, {$set:{createdAt: Date.now()}});
	},
	deleteCard:function(id){
		deleteChildCards(id);
		return true;
	}
});

var deleteChildCards = function(id){
	var count=userCards.find({parent_id: id}).count();
	if(count > 0){
		userCards.find({parent_id: id}).fetch().forEach(function (card) {
			deleteChildCards(card._id);
		});
	}
	userCards.remove({_id: id});
}