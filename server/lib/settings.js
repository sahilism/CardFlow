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
	var body="Hey,<br>Just wanted to say thank you. If you have any question, please ask away.<br><br><br>Thanks.<br>Team CardFlow"
	Email.send({
		to: user.emails[0].address,
		from: "CardFlow <hello@cardflow.com>",
		subject: "Welcome to CardFlow.com",
		html: body
	});
	return user;
});

Meteor.startup(function () {
	process.env.MAIL_URL="smtp://sahil%40impactomatic.com:bvBiaWVodKfoMFXCyyMwQg@smtp.mandrillapp.com:587"
});