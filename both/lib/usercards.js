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

removeChildCardsFn = function(id, userId){
  var childCards = userCards.find({ $and: [ { parent_id: id }, { user_id: userId } ] }).fetch();
  if(childCards.length > 0){
    childCards.forEach(function (cardInfo) {
      userCards.remove({ _id: cardInfo._id});
      // console.log(cardInfo._id, userId);
      return removeChildCardsFn(cardInfo._id, userId)
    });
  }
  return true;
}

getUserJSON  = function(userId){
  var userJSON = [];
  var allCards = userCards.find({ user_id: userId}, {sort: { createdAt: -1 }}).fetch();

  // index each item by title
  var indexed = allCards.reduce(function(result, item) {
    if(!item.cardTitle){
      item.cardTitle = "";
    }
    result[item._id] = item;
    return result;
  }, {});
  // return indexed;  
  // retain the root items only
  var result = allCards.filter(function(item) {
    
    // get parent
    var parent = indexed[item.parent_id];
    
    // make sure to remove unnecessary keys
    delete item.parent_id;
    delete item.has_children;
    delete item.is_selected;
    delete item.createdAt;
    delete item.user_id;
    delete item._id;
    delete item.inboxTitle;
    delete item.is_pinned;
    delete item.color;
    delete item.is_completed;
    delete item.notes;

    // item.content = item.cardTitle;
    // delete item.cardTitle;
    // has parent?
    if(parent) {
      // add item as a child
      parent.children = (parent.children || []).concat(item);
    }
    
    // This part determines if the item is a root item or not
    return !parent;
  });
  return result;
  return JSON.stringify(result, 0, 2)
}

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

removeChildCardsFn = function(id, userId){
  var childCards = userCards.find({ $and: [ { parent_id: id }, { user_id: userId } ] }).fetch();
  if(childCards.length > 0){
    childCards.forEach(function (cardInfo) {
      userCards.remove({ _id: cardInfo._id});
      // console.log(cardInfo._id, userId);
      return removeChildCardsFn(cardInfo._id, userId)
    });
  }
  return true;
}

getListViewJSON = function(userId){
  var userJSON = [];
  var allCards = userCards.find({ user_id: userId}, {sort: { createdAt: -1 }}).fetch();

  // index each item by title
  var indexed = allCards.reduce(function(result, item) {
    if(!item.cardTitle){
      item.cardTitle = "";
    }
    result[item._id] = item;
    return result;
  }, {});
  // return indexed;  
  // retain the root items only
  var result = allCards.filter(function(item) {
    
    // get parent
    var parent = indexed[item.parent_id];
    
    // make sure to remove unnecessary keys
    // delete item.parent_id;
    delete item.has_children;
    delete item.is_selected;
    delete item.createdAt;
    delete item.user_id;
    // delete item._id;
    delete item.inboxTitle;
    delete item.is_pinned;
    delete item.color;
    delete item.is_completed;
    delete item.notes;

    // item.content = item.cardTitle;
    // delete item.cardTitle;
    // has parent?
    if(parent) {
      // add item as a child
      parent.children = (parent.children || []).concat(item);
    }
    
    // This part determines if the item is a root item or not
    return !parent;
  });
  return result;
  return JSON.stringify(result, 0, 2)
}
getUserJSONForListView  = function(userId){
  var res = getListViewJSON(userId);
  var obj = {};
  obj["cardTitle"] = "Root";
  obj['children'] = res;
  return obj;
}