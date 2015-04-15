/*Meteor.startup(function () {
	//Test records for No orphan cards fnAyAeyiJRr6wvRo7
	var card= userCards.findOne({_id: "test record"});
	if(!card){
		userCards.insert({user_id:"fnAyAeyiJRr6wvRo7",parent_id: "test parent",_id:"test record",title:"test card"});
	}
	var card2= userCards.findOne({_id: "test record2"});
	if(!card2){
		userCards.insert({user_id:"fnAyAeyiJRr6wvRo7",_id: "test record2",title:"test card"});
	}

	//Test records for No delusional parents
	var card3= userCards.findOne({_id: "test has_children"});
	if(!card3){
		userCards.insert({user_id:"fnAyAeyiJRr6wvRo7",parent_id:"is_selected twice",_id: "test has_children",title:"test card",has_children: true});
	}
	//Test records for brotherly fight
	userCards.remove({_id: "is_selected twice"});
	userCards.insert({user_id:"fnAyAeyiJRr6wvRo7",_id: "is_selected twice",title:"test card",is_root:true});
	var card5= userCards.findOne({_id: "test brotherly fight"});
	if(!card5){
		userCards.insert({user_id:"fnAyAeyiJRr6wvRo7",_id: "test brotherly fight",parent_id:"is_selected twice", title:"test card",is_selected: true});
	}
	var card6= userCards.findOne({_id: "test brotherly fight2"});
	if(!card6){
		userCards.insert({user_id:"fnAyAeyiJRr6wvRo7",_id: "test brotherly fight2",parent_id:"is_selected twice", title:"test card",is_selected: true});		
	}
});*/