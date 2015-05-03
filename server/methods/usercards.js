Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
}

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
	getAdminCards:function(){
		var user=Meteor.users.findOne({"emails.address": "sahil@vmoq.com"});
		if(user){
			return userCards.find({user_id: user._id}).fetch();
		}
	},
	addRemainder:function(id, hours){
		var remind = new Date().addHours(hours);
		remind = remind.getTime();
		return userCards.update({_id: id}, {$set: {remind_at: remind}});
	}
});