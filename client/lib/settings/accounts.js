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
        Meteor.call('insertSessionRecords', Session.get("sessionid"),Meteor.userId(), function (error, result) {
          if(!error){
            toastr.success("All cards inserted");
            Router.go('/home')
          }
        });
      }
    }
  }
};
AccountsTemplates.configure({
    onSubmitHook: mySubmitFunc
});