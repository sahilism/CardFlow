/*Router.onBeforeAction(function(){
	if(Meteor.user()){
		this.next();
	}
})*/
Router.route("/",{
	template:"signin",
	onBeforeAction:function(){
		if(Meteor.user()){
			Router.go("/home");
		}
		else{
			this.next();
		}
	}
})
Router.route("/home",{
	template:"home",
	onBeforeAction:function(){
		if(Meteor.user()){
			this.next();
		}
		else{
			Router.go("/");
		}
	},
	waitOn:function(){
		return Meteor.subscribe('allusercards');
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
	action:function(){
		if(Meteor.user() && (Meteor.user().emails[0].address === "sahil@vmoq.com") ){
			this.render();
		}
		else{
			Router.go("/")
		}
	}
})