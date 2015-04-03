Meteor.publish('allusercards', function () {
	if(this.userId){
		var res=userCards.findOne({user_id: this.userId});
		var childcards=childCards.find({user_id:this.userId});
		if(res){
			var parentcards= userCards.find({user_id: this.userId},{sort: {createdAt: -1}});
			return [parentcards,childcards];
		}
		else{
			userCards.insert({user_id:this.userId,cardTitle:"My First Card",createdAt: Date.now()});
			var parentcards= userCards.find({user_id: this.userId},{sort: {createdAt: -1}});
			return [parentcards,childcards];
		}
	}
	else{
		this.ready();
	}
});