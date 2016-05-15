Template.registerHelper("formatDate",function(date){
	return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});
Template.registerHelper("formatReminderDate",function(date){
  date = parseInt(date);
  return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});
Template.registerHelper("isAdmin",function(){
	if(Meteor.user() && _.has(Meteor.user(), "emails") && (Meteor.user().emails[0].address === "sahil@vmoq.com") ){
		return true;
	}
	else{
		return false;
	}
});
Template.registerHelper('formatText', function(text){
  return text.replace(/\n/g, '<br/>');
})
Template.registerHelper('anchorme', function(text){
  var options = {
    "attributes":{
      "class":"anchorme-link",
      "id":"someIdHere",
      "target":"_blank"
    }
  };

  return anchorme.js(text,options);
})