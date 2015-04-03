Meteor.publish('allusercards', function () {
	if(this.userId){
		var res=usercards.findOne({user_id: this.userId});
		if(res){
			return usercards.find({user_id: this.userId});
		}
		else{
			var card={};
			card.title="My First Card";
			usercards.insert({user_id:this.userId,card:card});
			return usercards.find({user_id: this.userId});
		}
	}
	else{
		this.ready();
	}
});