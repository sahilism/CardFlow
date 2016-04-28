Meteor.startup(function () {
  // Reconnect Function
  reconnectToServer(10000, true);
});