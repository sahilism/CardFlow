getAssociateIds = function(id, userId){
  gArr = [id];
  var res = getNestedChildIds(id, userId);
  return gArr;
}
var getNestedChildIds = function(id, userId){
  var childCards = userCards.find({ $and: [ { parent_id: id }, { user_id: userId } ] }).fetch();
  if(childCards.length > 0){
    var ids = gArr || [];
    var pIds = _.pluck(childCards, '_id');
    ids = ids.concat(pIds);
    gArr = ids;
    childCards.forEach(function (childCardInfo) {
      return getNestedChildIds(childCardInfo._id, userId);
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