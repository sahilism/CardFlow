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
	getAccountsCount:function(){
		if(this.userId){
			return Meteor.users.find({}).count();
		}
	},
	getCardsdCount:function(){
		if(this.userId){
			return userCards.find({}).count();
		}
	},
	insertSessionRecords:function(sid,uid){
		demoCards.find({session_id:sid}).forEach(function (card) {
			card = _.omit(card, "session_id");
			_.extend(card, {user_id: uid});
			userCards.insert(card);
		});
		demoCards.remove({session_id:sid});
		return true;
	},
	removeSessionCards:function(sid){
		return demoCards.remove({session_id:sid});
	}
});