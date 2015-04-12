userCards.allow({
	insert: function (userId, doc) {
		if(doc.user_id === userId){
			if(_.has(doc,"parent_id")){
				userCards.update({_id:doc.parent_id}, {$set: {has_children: true}});
			}
			if(_.has(doc,"user_id")){
				if(userCards.find({user_id:doc.user_id}).count() > 1000){
					throw new Meteor.Error(401, 'You have reached maximum number of cards: 1000');
					return false;
				}
			}
			else{
				return false;
			}
			return true;
		}
	},
	update: function (userId, doc, fields, modifier) {
		if(doc.user_id === userId){
			return true;
		}
	},
	remove: function (userId, doc) {
		if(doc.user_id === userId){
			if(_.has(doc,"parent_id")){
				var count=userCards.find({parent_id:doc.parent_id}).count();
				if(count <= 0){
					console.log('setting has children false');
					userCards.update({_id: doc.parent_id}, {$set: {has_children: false}});
				}
			}
		}
		return false;
	}
});