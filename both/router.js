Router.onBeforeAction(function(){
	if(Meteor.user()){
		this.next();
	}
},{only: 'admin'})
Router.route("/",{
	template:"signin",
	onBeforeAction:function(){
		if(!Meteor.loggingIn()){
			if(Meteor.user()){
				Router.go("/home");
			}
			else{
				this.next();
			}	
		}
		
	}
})
Router.route("/home",{
	template:"home",
	onBeforeAction:function(){
		if(!Meteor.loggingIn()){
			if(Meteor.user()){
				this.next();
			}
			else{
				Router.go("/");
			}	
		}
	},
	waitOn:function(){

	},
	action:function(){
		if(this.ready()){
			this.render();
		}
	}
})
Router.route("/account",{
	template:"profile",
	action:function(){
		if(Meteor.user()){
			this.render();
		}
	}
})
Router.route("/logout",{
	template:"loading",
	onBeforeAction:function(){
		Meteor.logout();
		Router.go("/");
	}
})

Router.route("/admin",{
	template:"admin",
	waitOn:function(){
		if(Meteor.user() && _.has(Meteor.user(), "emails") && (Meteor.user().emails[0].address === "sahil@vmoq.com") ){
			Meteor.subscribe('sanityLogs');
		}
	},
	action:function(){
		if(this.ready()){
			if(Meteor.user() && _.has(Meteor.user(), "emails") &&  (Meteor.user().emails[0].address === "sahil@vmoq.com") ){
				this.render();
			}
			else{
				Router.go("/")
			}
		}
	}
});
Router.route("/demo",{
	template:"demoMain",
	onBeforeAction:function(){
		if(Meteor.user()){
			// toastr.error("You need to logout to view demo page.");
			Router.go('/home');
		}
		else{
			this.next();
		}
	}
});

Router.route("/mindmap/home",{
	template:"mindmap",
	waitOn:function(){
		return Meteor.subscribe('allusercards');
	}
});


Router.route("/help",{
	template:"help",
	onBeforeAction:function(){
		if(!Meteor.user()){
			Router.go('/');
		}
		else{
			this.next();
		}
	}
});

Router.route('/webhook/:id/:cardId', { where: 'server' })
.post(function () {
  var user   = this.params.id,
  	card   = this.params.cardId,
    query  = this.request.query,
    data = this.request.body
    fields = {};
	console.log(user, card, data);
 	if(user && card && data){
 		userCards.update({ $and: [ { user_id:user }, {parent_id: card}, {is_selected: true} ] }, { $set: { is_selected: false } });
	 	userCards.insert({user_id:user,cardTitle: data.text,has_children: false,is_selected:true,parent_id:card,createdAt:Date.now()});
		this.response.statusCode = 200;
		this.response.end( "Valid details" ); 	
	 }else{
	 	this.response.statusCode = 403;
		this.response.end( "Invalid data" );
	 }
  
})

Router.route('/create/inbox', { where: 'server' })
.post(function () {
	console.log(this.request);
	var body = this.request.body;
	if(body && body.text && body.user){
		userCards.insert({user_id:body.user,inboxTitle:body.text,has_children: false,is_selected:false,parent_id:"inbox",createdAt:Date.now()});
		this.response.statusCode = 200;
		this.response.end( "Saved to inbox." );	
	}else{
		this.response.statusCode = 403;
		this.response.end( "Please login to cardflow." );
	}
	
})

Router.route('/add/:id/:cardId', { where: 'server' })
.get(function () {
	var user   = this.params.id,
  	card   = this.params.cardId,
    query  = this.request.query    
	// console.log(user, card, query);
	if(user && card && query){
 		userCards.update({ $and: [ { user_id:user }, {parent_id: card}, {is_selected: true} ] }, { $set: { is_selected: false } });
 		if(query.title){
 			var cardTitle = query.title +" - "+query.url;
 		}else{
 			var cardTitle = query.url;
 		}
	 	userCards.insert({user_id:user,cardTitle: cardTitle,has_children: false,is_selected:true,parent_id:card,createdAt:Date.now()});
	 	var alertMsg = "alert('successfully added!');";
	 }else{
	 	var alertMsg = "alert('Invalid Data!');";
	 }

	this.response.statusCode = 200;
	this.response.setHeader("Content-Type", "application/javascript");
	this.response.end(alertMsg); 	
})

Router.route('/json/:_id', {
  where: 'server',
  action: function() {
  	var userId = this.params._id;
  	var obj = getUserJSON(userId);
  	// console.log(obj);
  	// var res = convertJsonToXml( 'cards', obj);
    this.response.writeHead(200, {'Content-Type': 'application/json'});
    this.response.end(obj);
  }
});