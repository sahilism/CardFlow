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
	waitOn:function(){
		return Meteor.subscribe('allusercards');
	}
})