Meteor.startup(function(){
  if (Meteor.isCordova){
    Push.debug = true
    console.log('startup event cordova');
    window.alert = navigator.notification.alert;
    //ONLY This works
    Push.addListener('token', function(token) {
     // console.log('token received: ' + JSON.stringify(token));
    });

    Push.addListener('error', function(err) {
     console.log(err);
    });
    Push.addListener('message', function(notification) {
     // Called on every message
     // console.log(JSON.stringify(notification))
     alert(notification.message);
   })

   Push.addListener('alert', function(notification) {
     // Called on every message
     Dialog.alert(notification.message);
     console.log(notification.message);
   });
)}
