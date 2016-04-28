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