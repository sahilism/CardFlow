cardscount = new Mongo.Collection('cardscount');

demoCards = new Mongo.Collection(null);
demoCards.find().observe({
	added: function (doc) {
		if(_.has(doc,"parent_id")){
			demoCards.update({_id:doc.parent_id}, {$set: {has_children: true}});
		}
		if(_.has(doc,"session_id")){
			if(demoCards.find({session_id:doc.session_id}).count() > 1000){
				throw new Meteor.Error(401, 'You have reached maximum number of cards: 1000');
				return false;
			}
		}
	},
	removed: function (doc) {
		if(_.has(doc,"parent_id")){
			var count=demoCards.find({parent_id:doc.parent_id}).count();
			if(count <= 1){
				demoCards.update({_id: doc.parent_id}, {$set: {has_children: false}});
			}
		}
	}
});