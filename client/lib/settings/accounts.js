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