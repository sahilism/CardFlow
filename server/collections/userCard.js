userCards.allow({
	insert: function (userId, doc) {
		if(doc.user_id === userId){
			if(_.has(doc,"parent_id")){
				userCards.update({_id:doc.parent_id}, {$set: {has_children: true}});
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
		return false;
	}
});