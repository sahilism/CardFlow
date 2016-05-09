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