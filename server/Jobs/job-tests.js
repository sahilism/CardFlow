//Test records for No orphan cards
userLogs.insert({parent_id: "test parent",_id:"test record",title:"test card"});
userLogs.insert({_id: "test record2",title:"test card"});

//Test records for No delusional parents
userLogs.insert({_id: "test has_children",title:"test card",has_children: true});

//Test records for brotherly fight
userLogs.insert({_id: "test record3",title:"test card"});
userLogs.insert({_id: "test brotherly fight",parent_id:"test record3", title:"test card",is_selected: true});
userLogs.insert({_id: "test brotherly fight2",parent_id:"test record3", title:"test card",is_selected: true});