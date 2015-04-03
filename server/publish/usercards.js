Meteor.publish('allusercards', function () {
	if(this.userId){
		var res=usercards.findOne({user_id: this.userId});
		if(res){
			return usercards.find({user_id: this.userId},{sort: {createdAt: -1}});
		}
		else{
			usercards.insert({user_id:this.userId,cardTitle:"My First Card",createdAt: Date.now()});
			return usercards.find({user_id: this.userId},{sort: {createdAt: -1}});
		}
	}
	else{
		this.ready();
	}
});