Meteor.publish('allusercards', function () {
  var self = this;
	if(self.userId){
		var res=userCards.findOne({user_id: self.userId});
		if(res){
			var parentcards= userCards.find({user_id: self.userId},{sort: {createdAt: -1}});
			return parentcards;
		}
		else{
			userCards.insert({user_id:self.userId,cardTitle:"My First Card",createdAt: Date.now(),parent_id : "root",is_selected:true,has_children : false});
			var parentcards= userCards.find({user_id: self.userId},{sort: {createdAt: -1}});
			return parentcards;
		}
	}
	else{
		self.ready();
	}
});

Meteor.publish('sanityLogs', function () {
	return Logs.find({},{sort: {timestamp: -1},limit: 20});
});

Meteor.publish('getPathCards', function () {
  var self = this;
  if(self.userId){
    var res = getPathCardsFn(self.userId);
    return userCards.find({ _id: { $in: res }});
  }
  self.ready();
});

Meteor.publish('reminderAndInboxCards', function () {
  var self = this;
  if(self.userId){
    return userCards.find({ $and: [ { user_id: self.userId }, { $or: [
        { remind_at: { $exists: true } },
        { parent_id: 'inbox' }
      ] } ] });
  }
  self.ready();
});

var subs = { };
Meteor.publish('getUsersCardsCount',function(){
	var subscription = this;
   	subs[subscription._session.id] = subscription;

   	Meteor.users.find({},{limit: 50,sort: {createdAt: -1}}).forEach(function (user) {
   		var newrecord={};
   		newrecord.count=userCards.find({user_id: user._id}).count();
   		newrecord.email= getEmailAddressOfUser(user);
   		newrecord.createdAt=user.createdAt;
   		subscription.added( 'cardscount', Random.id(), newrecord);
   	});

   	subscription.onStop(function() {
      delete subs[subscription._session.id];
   	});
})

var getEmailAddressOfUser = function(user){
	if(user.hasOwnProperty("emails") && user.emails.length > 0){
		return user.emails[0].address;
	}
	else if(user.hasOwnProperty("services") && (user.services).hasOwnProperty("facebook") ){
		return user.services.facebook.email;
	}
	else if(user.hasOwnProperty("services") && (user.services).hasOwnProperty("google") ){
		return user.services.google.email;
	}
}