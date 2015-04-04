userCards.allow({
	insert: function (userId, doc) {
		if(doc.user_id === userId){
			doc.createdAt= Date.now();
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