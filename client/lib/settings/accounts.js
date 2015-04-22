AccountsTemplates.configure({
    confirmPassword: true,
    enablePasswordChange: true,
    sendVerificationEmail: true,

    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,
    enforceEmailVerification:false,

    // Client-side Validation

    // Privacy Policy and Terms of Use
    // privacyUrl: 'privacy',
    // termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/home',
    redirectTimeout: 4000,

    // Hooks
    // onLogoutHook: myLogoutFunc,
    // onSubmitHook: mySubmitFunc,

    // Texts
   /* texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Passwod"
      },
    },*/
});
AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login'});

AccountsTemplates.configureRoute('signUp', {
    name: 'signup',
    path: '/signup'});
AccountsTemplates.configureRoute('resetPwd', {
    name: 'reset',
    path: '/reset-password'});

var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signUp") {
      var res=Session.get("creatingAccount");
      if(res){
        bootbox.confirm({
            message:"Do you want to restore your demo cards or start afresh?",
            buttons: {
                'cancel': {
                    label: 'Start from scratch',
                    className: 'btn-default'
                },
                'confirm': {
                    label: 'Restore demo cards',
                    className: 'btn-primary'
                }
            },
            callback:function(res){
              if(res){
                demoCards.find({$and: [{session_id:Session.get("sessionid")}, {parent_id: "root"}]}).forEach(function (card) {
                  saveCardsToserver(card,"root");
                });
              }
              Meteor.subscribe('allusercards');
            }
        })
      }
    }
  }
};
AccountsTemplates.configure({
    onSubmitHook: mySubmitFunc
});
saveCardsToserver = function(card,pid){
  var cardData= card;
  card = _.omit(card, "session_id");
  card = _.omit(card, "_id");
  _.extend(card, {user_id: Meteor.userId(), _id: Random.id(), parent_id: pid});
  var newId = userCards.insert(card);
  var res=demoCards.find({parent_id: cardData._id}).count();
  if(res > 0){
    demoCards.find({parent_id: cardData._id}).forEach(function (childcard) {
      saveCardsToserver(childcard,newId);
    });
  }
  
}