Meteor.publish('allusercards', function () {
	if(this.userId){
		var res=userCards.findOne({user_id: this.userId});
		if(res){
			var parentcards= userCards.find({user_id: this.userId},{sort: {createdAt: -1}});
			return parentcards;
		}
		else{
			userCards.insert({user_id:this.userId,cardTitle:"My First Card",createdAt: Date.now(),is_root : true,is_selected:true,has_children : false});
			var parentcards= userCards.find({user_id: this.userId},{sort: {createdAt: -1}});
			return parentcards;
		}
	}
	else{
		this.ready();
	}
});

Meteor.publish('sanityLogs', function () {
	return Logs.find({},{sort: {timestamp: -1},limit: 20});
});