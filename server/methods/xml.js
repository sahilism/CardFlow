Meteor.methods({
  getJson: function (userId) {
    return getUserJSON(userId);
  }
});
var js2xmlparser = Meteor.npmRequire( 'js2xmlparser' );

convertJsonToXml = function( root, data ){
  return js2xmlparser( root, data );
};
// {
//   "card": [
//     { "title": "Letters to a Young Poet", "author": "Rainer Maria Rilke" },
//     { "title": "Changing My Mind", "author": "Zadie Smith" },
//     { "title": "Managing Oneself", "author": "Peter Drucker" }
//   ]
// }
getUserXml = function(userId){
  var obj = {};
  var cardsArr = [];
  var allCards = getParentXML(userId, 'root')
  cardsArr =allCards;
  obj['card'] = allCards;
  console.log(JSON.stringify(obj));
  return obj;
}
var resCards = []
getParentXML = function(userId, parent_id){
  var allCards = userCards.find({ $and: [ { user_id: userId }, { parent_id: parent_id } ] }).fetch();
  if(allCards.length > 0){
    allCards.forEach(function (cardInfo) {
      cardInfo.child_cards = getParentXML(userId, cardInfo._id);
      resCards.push(cardInfo)
      return getParentXML(userId, cardInfo._id)
    });  
  }else{
    return userCards.find({ $and: [ { user_id: userId }, { _id: parent_id } ] }).fetch();;
  }
  
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

    // has parent?
    if(parent) {
      // add item as a child
      parent.children = (parent.children || []).concat(item);
    }
    
    // This part determines if the item is a root item or not
    return !parent;
  });

  return JSON.stringify(result, 0, 2)
}

getJSONCards = function(userId, parent_id, userData){
  var allCards = userCards.find({ $and: [ { user_id: userId }, { parent_id: parent_id } ] }).fetch();
  if(allCards.length > 0){
    allCards.forEach(function (cardInfo) {
      var isExist = $.grep(userData, function(e){ return e.content === parent_id; });
      if(isExist){
        
      }
    });
  }
}
