demoCards.allow({
	insert: function (userId, doc) {
		if(_.has(doc,"parent_id")){
			userCards.update({_id:doc.parent_id}, {$set: {has_children: true}});
		}
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		if(_.has(doc,"parent_id")){
			var count=userCards.find({parent_id:doc.parent_id}).count();
			if(count <= 1){
				userCards.update({_id: doc.parent_id}, {$set: {has_children: false}});
			}
		}
		return true;
	}
});