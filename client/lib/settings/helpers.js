Template.registerHelper("formatDate",function(date){
	return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});
Template.registerHelper("isAdmin",function(){
	if(Meteor.user() && (Meteor.user().emails[0].address === "sahil@vmoq.com") ){
		return true;
	}
	else{
		return false;
	}
});