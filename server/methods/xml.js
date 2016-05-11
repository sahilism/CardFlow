Meteor.methods({
  getProfileJson: function (userId) {
    return getUserJSON(userId);
  }
});


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