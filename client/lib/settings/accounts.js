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
        demoCards.find({session_id:Session.get("sessionid")}).forEach(function (card) {
          card = _.omit(card, "session_id");
          card = _.omit(card, "_id");
          _.extend(card, {user_id: Meteor.userId(), _id: Random.id()});
          userCards.insert(card);
        });
        demoCards.remove({session_id:Meteor.userId()});
      }
    }
  }
};
AccountsTemplates.configure({
    onSubmitHook: mySubmitFunc
});