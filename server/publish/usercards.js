Meteor.publish('allusercards', function () {
	if(this.userId){
		var res=userCards.findOne({user_id: this.userId});
		if(res){
			var parentcards= userCards.find({user_id: this.userId},{sort: {createdAt: -1}});
			return parentcards;
		}
		else{
			userCards.insert({user_id:this.userId,cardTitle:"My First Card",createdAt: Date.now(),parent_id : "root",is_selected:true,has_children : false});
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

var subs = { };
Meteor.publish('getUsersCardsCount',function(){
	var subscription = this;
   	subs[subscription._session.id] = subscription;

   	Meteor.users.find({},{limit: 50,sort: {createdAt: -1}}).forEach(function (user) {
   		var newrecord={};
   		newrecord.count=userCards.find({user_id: user._id}).count();
   		newrecord.email=user.emails[0].address;
   		newrecord.createdAt=user.createdAt;
   		subscription.added( 'cardscount', Random.id(), newrecord);
   	});

   	subscription.onStop(function() {
      delete subs[subscription._session.id];
   	});
})