SyncedCron.add({
    name: 'No brotherly fight',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    }, 
    job: function() {
        Logs.insert({title: "Sanity check violation",desc:"No brotherly fight job started.",timestamp: Date.now()});
        Meteor.users.find().forEach(function (user) {
          userCards.find({$and: [{user_id: user._id},{parent_id: "root"}] }).forEach(function (card) {
            checkBrotherlyFight(card._id,card.user_id);
          });
        });
        Logs.insert({title: "Sanity check violation",desc:"No brotherly fight job ended.",timestamp: Date.now()});
    }
});
SyncedCron.add({
    name: 'No delusional parents',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    }, 
    job: function() {
      Logs.insert({title: "Sanity check violation",desc:"No delusional parents job started.",timestamp: Date.now()});
      userCards.find().forEach(function (card) {
      	if(_.has(card,"has_children") && card.has_children){
      		var childCardsCount=userCards.find({parent_id: card._id}).count();
      		if(childCardsCount <= 0){
      			Logs.insert({title: "Sanity check violation",desc:"Card has no children but has_children property is set to true",user:card.user_id,timestamp: Date.now(),card_id: card._id});
      			userCards.update({_id: card._id}, {$set: { has_children: false }});
      		}
      	}
      });
      Logs.insert({title: "Sanity check violation",desc:"No delusional parents job ended.",timestamp: Date.now()});
    }
});
SyncedCron.add({
    name: 'No orphan cards',
    schedule: function(parser) {
      return parser.text('every 1 hour');
    }, 
    job: function() {
      Logs.insert({title: "Sanity check violation",desc:"No orphan cards job started.",timestamp: Date.now()});
      userCards.find().forEach(function (card) {
        var isParentExists= userCards.findOne({_id: card.parent_id});
      	if(!isParentExists && (card.parent_id !== "root") ){
            Logs.insert({title: "Sanity check violation",desc:"Card parent id doesn't exists and the card is not a root",user:card.user_id,timestamp: Date.now(),card_id: card._id});
           var ssid={card_id:card._id};
           var cardid=card._id;
           card = _.omit(card, "_id");
           _.extend(card, ssid);
           Archive.insert(card);
           userCards.remove({_id: cardid});
      	}
      });
      Logs.insert({title: "Sanity check violation",desc:"No orphan job ended.",timestamp: Date.now()});
    }
});

var checkBrotherlyFight = function(id,userid){
	var count=userCards.find({$and: [{user_id: userid},{parent_id: id},{is_selected: true} ] }).count();
	if(count > 1){
		Logs.insert({title: "Sanity check violation",desc:"Card has more than one 'is_selected' property as true with same parent",user:userid,timestamp: Date.now(),card_id: id});
		userCards.find({$and: [{user_id: userid},{parent_id: id}] }).forEach(function (card) {
			userCards.update({_id: card._id}, {$set: {is_selected: false}});
		});
	}
  userCards.find({$and: [{user_id: userid},{parent_id: id}] }).forEach(function (childcard) {
      checkBrotherlyFight(childcard._id,childcard.user_id);
  });
	
}

Meteor.startup(function () {
	SyncedCron.start();
});