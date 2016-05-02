ApiV1.addRoute('webhook/:id/:cardId', { authRequired: false }, {
  post: function() {
    var params = this.urlParams;
    console.log(params);
    return params;
    // if (params && params.id) {
    //   // console.log(params.id);
    //   Accounts.sendVerificationEmail(params.id);
    //   var userId = this.request.headers['x-user-id'];
    //   var user = Meteor.users.findOne({ _id: userId});
    //   if (user && user.emails[0] && user.emails[0].address) {
    //     SAMembers.update({ email: user.emails[0].address }, {$set: { verifyMailSent: true } });
    //     var member = SAMembers.findOne({ email: user.emails[0].address});
    //     if( member && member.appAccess && member.appAccess !== "ON APP"){
    //       return {
    //         statusCode: 403,
    //         message: APIErrors.userIdNotFound
    //       };
    //     }
    //   }
    //   return {
    //     statusCode: 200,
    //     body: {
    //       status: "success",
    //       message: "Email sent."
    //     }
    //   };
    // } else {
    //   return {
    //     statusCode: 403,
    //     message: APIErrors.userIdNotFound
    //   };
    // }
  },
  get: function() {
    var params = this.urlParams;
    console.log(params);
    return params;
  }
})