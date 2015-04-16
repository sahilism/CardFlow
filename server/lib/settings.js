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
	Email.send({
		to: user.emails[0].address,
		from: "CardFlow <no-reply@cardflow.com>",
		subject: "Welcome to CardFlow",
		text: "sss"
	});
	return user;
});