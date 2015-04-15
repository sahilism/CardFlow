Meteor.methods({
  checkPasswordandReset: function(digest) {
    check(digest, String);

    if (this.userId) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      if(result.error == null){
        userCards.remove({user_id: this.userId});
        return userCards.insert({user_id:this.userId,cardTitle:"My First Card",createdAt: Date.now(),parent_id : "root",is_selected:true,has_children : false});
      }
      else{
        throw new Meteor.Error(401,"Incorrect password.")
      }
    } else {
      throw new Meteor.Error(401,"Login to reset the account.")
    }
  },
  getUserCarsdCount:function(id){
    return userCards.find({user_id: id}).count();
  }
});