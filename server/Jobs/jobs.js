SyncedCron.add({
    name: 'No orphan cards',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    }, 
    job: function() {
      userCards.find().forEach(function (card) {
      	if(_.has(card,"parent_id")){
      		var isParentExists= userCards.findOne({_id: card.parent_id});
      		if(!isParentExists){
      			Logs.insert({title: "Sanity check violation",desc:"Card parent doesn't exist",user:card.user_id,timestamp: Date.now(),card_id: card._id,parent_id: card.parent_id});
      			Archive.insert(user);
      		 	userCards.remove({_id: card._id});
      		}
      	}
      	else if(card.is_root){

      	}
      	else {
      		 Logs.insert({title: "Sanity check violation",desc:"Card neither has parent nor is root card",user:card.user_id,timestamp: Date.now(),card_id: card._id});
      		 Archive.insert(user);
      		 userCards.remove({_id: card._id});
      	}
      });		
    }
});

SyncedCron.add({
    name: 'No delusional parents',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    }, 
    job: function() {
      userCards.find().forEach(function (card) {
      	if(_.has(card,"has_children") && card.has_children){
      		var childCardsCount=userCards.find({parent_id: card._id}).count();
      		if(childCardsCount <= 0){
      			Logs.insert({title: "Sanity check violation",desc:"Card has no children but has_children property is set to true",user:card.user_id,timestamp: Date.now(),card_id: card._id});
      			userCards.update({_id: card._id}, {$set: { has_children: false }});
      		}
      	}
      });		
    }
});
  
SyncedCron.add({
    name: 'No brotherly fight',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    }, 
    job: function() {
      	Meteor.users.find().forEach(function (user) {
      		checkRootFight(user._id);
      		userCards.find({$and: [{user_id: user._id},{is_root: true}] }).forEach(function (card) {
      			checkBrotherlyFight(card._id,card.user_id);
      		});
      	});
    }
});
var checkRootFight=function(id){
	var rootSelectedCount=userCards.find({$and: [{user_id: id},{is_root: true},{is_selected: true}] }).count();
	if(rootSelectedCount > 1){
		Logs.insert({title: "Sanity check violation",desc:"User root cards has more than one 'is_selected' property as true",user:id,timestamp: Date.now()});
		userCards.find({$and: [{user_id: id},{is_root: true}] }).forEach(function (card) {
      		userCards.update({_id: card._id}, {$set: {is_root: false}});
      	});
	}

}
var checkBrotherlyFight = function(id,userid){
	var count=userCards.find({$and: [{user_id: userid},{parent_id: id},{is_selected: true} ] }).count();
	if(count > 1){
		Logs.insert({title: "Sanity check violation",desc:"Card has more than one 'is_selected' property as true with same parent",user:userid,timestamp: Date.now(),parent_id: id});
		userCards.find({$and: [{user_id: userid},{parent_id: id}] }).forEach(function (card) {
			userCards.update({_id: card._id}, {$set: {is_selected: false}});
		});
	}
	var childcardcount = userCards.find({$and: [{user_id: userid},{parent_id: id}] }).count();
	if(childcardcount > 0){
		userCards.find({$and: [{user_id: userid},{parent_id: id}] }).forEach(function (childcard) {
			checkBrotherlyFight(childcard,childcard.user_id);
		});
	}
}

Meteor.startup(function () {
	SyncedCron.start();
});