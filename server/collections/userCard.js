userCards.allow({
	insert: function (userId, doc) {
		return false;
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