Meteor.methods({
  getProfileJson: function (userId) {
    return getUserJSON(userId);
  }
});