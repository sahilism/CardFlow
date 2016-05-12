Meteor.startup(function () {
  Blaze._allowJavascriptUrls();
  reconnectToServer(5000, false);
});