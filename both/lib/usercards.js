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

getPathCardsFn = function(userId){
  var pathIds = [];
  var res = getSelectedId(userId, "root", pathIds);
  return res;
}

getSelectedId = function(userId, parentId, pathIds){
  var cards = userCards.find({ $and: [ { user_id: userId }, { parent_id: parentId } ] }).fetch();
  if(cards.length > 0){
    // pathIds.push(card._id);
    var ids = _.pluck(cards, '_id');
    pathIds = pathIds.concat(ids);
    // console.log(cards);
    var result = _.find(cards, function(e){ return e.is_selected === true; });
    // console.log(result);
    if(result){
      return getSelectedId(userId, result._id, pathIds)
    }else{
      return pathIds;
    }
  }
  return pathIds;
}