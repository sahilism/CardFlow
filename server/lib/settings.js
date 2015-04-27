BrowserPolicy.content.allowOriginForAll('http://*.googleapis.com');
BrowserPolicy.content.allowOriginForAll('http://*.gstatic.com');

Accounts.emailTemplates.from = 'CardFlow <no-reply@cardflow.com>';
Accounts.emailTemplates.siteName = 'CardFlow';

Accounts.urls.resetPassword = function (token) {
   return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.emailTemplates.verifyEmail.text = function(user, url) {
	return 'Click on the following link to verify your email address: ' + url;
};

Accounts.onCreateUser(function (options, user) {
	Meteor.defer(function(){
		var body="Hey,<br><br> Just wanted to say thank you. If you have any question, please ask away.<br><br>Thanks.<br>Team CardFlow"
		Email.send({
			to: user.emails[0].address,
			from: "CardFlow <hello@cardflow.com>",
			subject: "Welcome to CardFlow.com",
			html: body
		});
	})
	
	return user;
});

Meteor.startup(function () {
	process.env.MAIL_URL="smtp://sahil%40impactomatic.com:bvBiaWVodKfoMFXCyyMwQg@smtp.mandrillapp.com:587"
});

ServiceConfiguration.configurations.upsert(
  { service: "google" },
  {
    $set: {
      clientId: "514576121691-9poqcfdss8ab3tubmc6ctffb8cap0i1q.apps.googleusercontent.com",
      loginStyle: "popup",
      secret: "jHqMYpiszLFAO2WRT3kmh1Ve"
    }
  }
);
ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: " 754153301358678",
      loginStyle: "popup",
      secret: "jHqMYpiszLFAO2WRT3kmh1Ve"
    }
  }
);