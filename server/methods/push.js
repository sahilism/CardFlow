Push.allow({
  send: function(userId, notification) {
      return true; // Allow all users to send
  }
});
Meteor.methods({
  sendNotif: function () {
    var userId = this.userId;
    Push.send({
      from: 'test app',
      title: 'hello',
      text: 'hello world',
      query: {
        userId: userId
      }
    });
  }
});