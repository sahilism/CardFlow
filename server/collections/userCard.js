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
		var allGood = true;
		var index = fields.indexOf('parent_id');
		if(index > -1){
			var set = modifier['$set'];
			var parent_id = set["parent_id"];
			if(parent_id && doc.parent_id){
				var aIds = getAssociateIds(doc._id, userId);
				aIds.push(doc._id)
				if(aIds.indexOf(parent_id) > -1){
					allGood = false;
				}
			}
		}
		if(doc.user_id !== userId){
			allGood = false;
		}
		return allGood
	},
	remove: function (userId, doc) {
		if(doc.user_id === userId){
			if(_.has(doc,"parent_id")){
				var count=userCards.find({parent_id:doc.parent_id}).count();
				if(count <= 1){
					userCards.update({_id: doc.parent_id}, {$set: {has_children: false}});
				}
			}
			return true;
		}
		else{
			return false;
		}
	}
});

getAssociateIds = function(id, userId){
	gArr = [id];
	var res = getNestedChildIds(id, userId);
	return gArr;
}
var getNestedChildIds = function(id, userId){
	var childCards = userCards.find({ $and: [ { parent_id: id }, { user_id: userId } ] }).fetch();
	if(childCards.length > 0){
		childCards.forEach(function (childCardInfo) {
			return getNestedChildIds(childCardInfo._id);
		});
	}else{
		var ids = gArr || [];
		if(ids.indexOf(id) <= -1){
			ids.push(id);
			gArr = ids;
		}
		return id;
	}
}